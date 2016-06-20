import Notp from 'notp';
import AppConfig from '../../config';

export default function(key, token) {
  if (!token) {
    return Notp.totp.gen(key, { time: AppConfig.get('/notp/time'), characters: AppConfig.get('/notp/characters') });
  }

  var res = Notp.totp.verify(token, key, { time: AppConfig.get('/notp/time'), characters: AppConfig.get('/notp/characters') });
  if (!res || res.delta < 0) {
    return false;
  }
  return true;
}
