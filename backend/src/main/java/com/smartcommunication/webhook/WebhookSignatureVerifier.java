package com.smartcommunication.webhook;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

public class WebhookSignatureVerifier {

    private static final String HMAC_SHA256 = "HmacSHA256";

    public static String calculateSignature(String payload, String secret) {
        try {
            Mac mac = Mac.getInstance(HMAC_SHA256);
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), HMAC_SHA256);
            mac.init(secretKey);
            byte[] rawHmac = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : rawHmac) {
                sb.append(String.format("%02x", b));
            }
            return "sha256=" + sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error computing webhook HMAC signature", e);
        }
    }

    public static boolean verifySignature(String payload, String signature, String secret) {
        if (signature == null || secret == null) {
            return false;
        }
        String computed = calculateSignature(payload, secret);
        return MessageDigest.isEqual(computed.getBytes(StandardCharsets.UTF_8), signature.getBytes(StandardCharsets.UTF_8));
    }
}
