import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import passport from 'passport';
import userService from './services/user-service';
import { IUser } from './models/user';
import getDB from './db/db';

export const initPassport = () => {
    const opts: StrategyOptions = {
        jwtFromRequest:  ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET!
    }
    passport.use(new Strategy(opts, async (jwtPayload, done) => {
        try {
            const user: IUser | null = await userService.getByEmail(jwtPayload?.email, getDB());
            if (user)
                return done(null, user);
            return done(null, false);
        } catch (e) {
            console.error(e);
            return done(e, false);
        }
    }));
}
