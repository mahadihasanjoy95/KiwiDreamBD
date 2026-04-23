package com.kiwi.dream.security;

import java.util.Map;
import java.util.Set;

public interface ApiPermissionCache {
    Map<String, String> getAll();
    Set<String> getPublicRoutes();
    Set<String> getAuthenticatedOnlyRoutes();
    void evict();
}
