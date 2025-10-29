-- Restrict user_analytics_summary view to prevent exposure of auth.users data
-- Only service_role will have direct database access
-- Application-level admin checks via useIsAdmin hook will control frontend access

-- Revoke public access to the view
REVOKE SELECT ON user_analytics_summary FROM authenticated;
REVOKE SELECT ON user_analytics_summary FROM anon;

-- Grant access only to service role (for backend operations and admin queries)
GRANT SELECT ON user_analytics_summary TO service_role;