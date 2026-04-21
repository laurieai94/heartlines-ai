

## Repo organization assessment

Your **root-level folders are clean and conventional** — `docs/`, `public/`, `src/`, `supabase/`, `remotion/` are all standard and well-named. No changes needed there.

The real organizational debt lives **inside `src/components/`**: ~60 loose component files sitting alongside 22 feature folders. There's also inconsistency — some folders use `PascalCase` (`ConversationPractice/`, `Demographics/`, `ProfileBuilder/`), others use `lowercase` (`chat/`, `auth/`, `admin/`). Per your project convention, everything should be lowercase.

### Proposed cleanup (src/components only)

**1. Rename PascalCase folders to lowercase** (matches your stated convention):
- `ConversationPractice/` → `conversation-practice/`
- `Demographics/` → `demographics/`
- `NewPartnerProfile/` → `new-partner-profile/`
- `NewPersonalQuestionnaire/` → `new-personal-questionnaire/`
- `PartnerProfileQuestionnaire/` → `partner-profile-questionnaire/`
- `PersonalProfileQuestionnaire/` → `personal-profile-questionnaire/`
- `ProfileBuilder/` → `profile-builder/`
- `ProfileForm/` → `profile-form/`
- `ThoughtfulActions/` → `thoughtful-actions/`

**2. Group the 60 loose files into feature folders:**

| New folder | Files moved in |
|---|---|
| `chat/` (exists) | `AIChat.tsx`, `AIChatInput.tsx`, `AIChatMessage.tsx`, `AICoachEngine.tsx`, `AISidebar.tsx`, `ChatBubble.tsx`, `ChatContainer.tsx`, `ConversationStarters.tsx`, `VoiceInterface.tsx`, `WelcomeToKaiDialog.tsx` |
| `dashboard/` (new) | `DashboardContent.tsx`, `DashboardHeader.tsx`, `DashboardHome.tsx`, `DashboardModals.tsx`, `DashboardNavigation.tsx`, `NavAvatar.tsx`, `NavigationPullTab.tsx` |
| `landing/` (new) | `LandingPage.tsx`, `HeroCarousel.tsx`, `HeroPhoneScroll.tsx`, `HowItWorksSwipe.tsx`, `PhotoSplitBanner.tsx`, `ProductPhoneDemo.tsx`, `Company.tsx`, `YearCarousel.tsx`, `SignUpModal.tsx`, `SignInButton.tsx`, `UnlockCoachingButton.tsx` |
| `layout/` (new) | `SiteFooter.tsx`, `SimpleHeader.tsx`, `SplashScreen.tsx`, `FirstVisitSplash.tsx`, `ScrollToTop.tsx`, `ScrollReveal.tsx` |
| `brand/` (exists) | `BrandLoadingText.tsx`, `BrandLogo.tsx`, `BrandMark.tsx`, `HeartAppIcon.tsx`, `FlameBackground.tsx`, `FlameDivider.tsx`, `FlameIconHalo.tsx`, `MiniFlamesOverlay.tsx`, `BubbleBackground.tsx`, `PremiumBackground.tsx` |
| `profile/` (exists) | `ProfileBuilder.tsx`, `ProfileForm.tsx`, `ProfileViewer.tsx`, `ProfileCompletionOptions.tsx`, `AvatarUpload.tsx`, `Demographics.tsx`, `PartnerProfileQuestionnaire.tsx`, `PersonalProfileQuestionnaire.tsx`, `QuestionnaireModal.tsx`, `OnboardingStepNudge.tsx`, `ThoughtfulActions.tsx`, `ConversationPractice.tsx` |
| `auth/` (exists) | `AuthGuard.tsx`, `ProgressiveAccessWrapper.tsx` |
| `privacy/` (exists) | `PrivacySettings.tsx` |
| `system/` (new) | `ErrorBoundary.tsx`, `MobileErrorBoundary.tsx`, `MobileProfileBoundary.tsx`, `AIInsights.tsx` |

**3. Update imports** across the codebase to point to new paths. All consuming files (pages, contexts, other components) get their `@/components/...` import paths rewritten.

### Risk + scope

- **Pure refactor** — no behavior changes, no UI changes
- **Touches a lot of files** — every import of a moved component needs updating (likely 100+ import statements)
- **Safe** — TypeScript will catch any missed imports at build time
- **Brand convention preserved** — lowercase folders match your established standard

### What I'd skip

- Root folders are fine, don't touch them
- `src/` subfolders (`hooks/`, `services/`, `lib/`, etc.) are well-organized already
- `supabase/`, `remotion/`, `docs/`, `public/` — leave alone

### Recommendation

This is real cleanup that pays off long-term but it's a big diff. Two options:

1. **Do it all at once** — one large PR, painful to review but done in one shot
2. **Do it in phases** — first rename PascalCase folders, then group loose files by feature one folder at a time

Want me to proceed with option 1, option 2, or just the PascalCase rename (smallest, highest-value win)?

