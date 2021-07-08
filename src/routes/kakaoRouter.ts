import { Router } from 'express';
import { kakaoController } from '../controllers';

const router = Router();
/**
 * 클라이언트 없이 서버 테스트 시에는 아래 주석을 풀고 진행하세요.
  router.get('/kakao/callback', kakaoController.getKakaoUser);
*/
router.post('/user', kakaoController.getKakaoUser);
export default router;