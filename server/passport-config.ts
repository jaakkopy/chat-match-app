import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import passport from 'passport';
import userService from './services/user-service';
import getDB from './db/db';
import ServiceResult from './models/service-result';

export const initPassport = () => {
    const opts: StrategyOptions = {
        jwtFromRequest:  ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET!
    }
    passport.use(new Strategy(opts, async (jwtPayload, done) => {
        try {
            const res: ServiceResult = await userService.getByEmail(jwtPayload?.email, getDB());
            if (res.ok)
                return done(null, res.data);
            return done(null, false);
        } catch (e) {
            console.error(e);
            return done(e, false);
        }
    }));
}
