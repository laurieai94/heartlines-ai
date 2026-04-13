

## Add flip phone icon to the footer brand name

**File**: `src/components/SiteFooter.tsx`

1. Import `FlipPhoneIcon` from `@/components/icons/FlipPhoneIcon`
2. In both the mobile (line 63) and desktop (line 103) brand sections, wrap the `<h3>` content with `inline-flex items-center gap-2` and add `<FlipPhoneIcon size={20} />` next to `{BRAND.name}`

