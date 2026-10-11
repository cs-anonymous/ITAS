package com.buaa.annotation.security.service;

import com.buaa.annotation.model.LoginUser;
import com.buaa.annotation.util.RedisCache;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class TokenService {
    protected static final long MILLIS_SECOND = 1000;

    protected static final long MILLIS_MINUTE = 60 * MILLIS_SECOND;

    private static final Long MILLIS_MINUTE_TWENTY = 20 * 60 * 1000L;

    // 令牌自定义标识
    private static final String header = "Authorization";

    // 令牌秘钥
    private static final String secret = "annotation_sys";

    // 令牌有效期，单位分钟
    private static final int expireTime = 60;

    // redis login_user_key
    public static final String LOGIN_USER_KEY = "login_user_key";

    // redis token_key
    public static final String LOGIN_TOKEN_KEY = "login_token";

    // token前缀
    public static final String TOKEN_PREFIX = "Bearer ";

    @Autowired
    private RedisCache redisCache;

    /**
     * 获取用户身份信息
     *
     * @return 用户信息
     */
    public LoginUser getLoginUser(HttpServletRequest request) {
        // 获取请求携带的令牌
        String token = request.getHeader(header);
        if (Strings.isNotBlank(token) && token.startsWith(TOKEN_PREFIX)) {
            token = token.replace(TOKEN_PREFIX, "");
            if (Strings.isNotBlank(token)) {
                Claims claims = parseToken(token);
                // 解析对应的权限以及用户信息
                String uuid = (String) claims.get(LOGIN_USER_KEY);
                String userKey = getTokenKey(uuid);
                return redisCache.getCacheObject(userKey);
            }
        }
        return null;
    }

    /**
     * 创建令牌
     *
     * @param loginUser 用户信息
     * @return 令牌
     */
    public String createToken(LoginUser loginUser) {
        String token = UUID.randomUUID().toString();
        loginUser.setToken(token);
        refreshToken(loginUser);
        Map<String, Object> claims = new HashMap<>();
        claims.put(LOGIN_USER_KEY, token);
        return Jwts.builder()
                .setClaims(claims)
                .signWith(SignatureAlgorithm.HS512, secret).compact();
    }

    /**
     * 删除用户身份信息
     */
    public void delLoginUser(String token) {
        if (Strings.isNotBlank(token)) {
            String userKey = getTokenKey(token);
            redisCache.deleteObject(userKey);
        }
    }

    /**
     * 验证令牌有效期，相差不足20分钟，自动刷新缓存
     *
     * @param loginUser 用户信息
     */
    public void verifyToken(LoginUser loginUser) {
        Date expireTime = loginUser.getExpireTime();
        Date currentTime = new Date(System.currentTimeMillis());
        if (expireTime.getTime() - currentTime.getTime() <= MILLIS_MINUTE_TWENTY) {
            refreshToken(loginUser);
        }
    }

    /**
     * 刷新令牌有效期
     *
     * @param loginUser 登录信息
     */
    public void refreshToken(LoginUser loginUser) {
        loginUser.setLoginTime(new Date(System.currentTimeMillis()));
        loginUser.setExpireTime(new Date(loginUser.getLoginTime().getTime() + expireTime * MILLIS_MINUTE));
        // 根据uuid将loginUser缓存
        String userKey = getTokenKey(loginUser.getToken());
        redisCache.setCacheObject(userKey, loginUser, expireTime, TimeUnit.MINUTES);
    }

    /**
     * 从令牌中获取数据声明
     *
     * @param token 令牌
     * @return 数据声明
     */
    private Claims parseToken(String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
    }

    private String getTokenKey(String uuid) {
        return LOGIN_TOKEN_KEY + ":" + uuid;
    }

}
