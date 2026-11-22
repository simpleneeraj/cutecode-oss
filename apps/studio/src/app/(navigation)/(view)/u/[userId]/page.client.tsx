"use client";

import { AnimatePresence, motion } from "motion/react";
import { UsersGroupRoundedIcon } from "@solar-icons/react/linear/users-group-rounded";
import { UserCrossRoundedIcon } from "@solar-icons/react/linear/user-cross-rounded";
import { CodeSquareIcon } from "@solar-icons/react/linear/code-square";
import { useUserProfile, useToggleFollow, type UserProfileOutput } from "@/hooks/use-user";
import { useSnippetExplore, type SnippetExploreOutput } from "@/hooks/use-snippet";
import { Avatar, AvatarFallback } from "@cutecode/ui/components/avatar";
import { Button } from "@cutecode/ui/components/button";
import { Badge } from "@cutecode/ui/components/badge";
import { Card } from "@cutecode/ui/components/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@cutecode/ui/components/empty";
import { Skeleton } from "@cutecode/ui/components/skeleton";
import { ExploreSnippetCard } from "@/components/snippet/explore-snippet-card";
import { SLIDE_UP, EASE_OUT, FADE_IN } from "@/lib/motion";
import View from "@/components/view";
import { useUser } from "@/hooks/use-auth";
import { profileStyles } from "./style";

type ProfilePageClientProps = {
  userId: string;
};

type ProfileHeaderProps = {
  profile: NonNullable<UserProfileOutput>;
  canFollow: boolean;
  isFollowPending: boolean;
  onFollowToggle: () => void;
};

type ProfileSnippet = SnippetExploreOutput["snippets"][number];

enum SnippetsView {
  Loading = "loading",
  Empty = "empty",
  Grid = "grid",
}

type SnippetsContentProps = {
  view: SnippetsView;
  snippets: ProfileSnippet[];
};

const profileMotion = {
  skeletonKeys: Array.from({ length: 6 }, (_, i) => `skeleton-${i}`),
  fadeOut: { opacity: 0 },
};

const styles = profileStyles();

function ProfileSkeleton() {
  return (
    <View className={styles.scroll()}>
      <View className={styles.root()} aria-busy="true">
        <Card className={styles.header()}>
          <Skeleton className={styles.avatarSkeleton()} />
          <div className={styles.info()}>
            <Skeleton className={styles.nameSkeleton()} />
            <Skeleton className={styles.metaSkeleton()} />
          </div>
        </Card>
        <div className={styles.grid()}>
          {profileMotion.skeletonKeys.map((key) => (
            <Skeleton key={key} className={styles.cardSkeleton()} />
          ))}
        </div>
      </View>
    </View>
  );
}

function ProfileNotFound() {
  return (
    <View className={styles.center()}>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <UserCrossRoundedIcon aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>User not found.</EmptyTitle>
        </EmptyHeader>
      </Empty>
    </View>
  );
}

function ProfileHeader({ profile, canFollow, isFollowPending, onFollowToggle }: ProfileHeaderProps) {
  const authorInitial = (profile.name || "?").charAt(0).toUpperCase();
  const followers = profile._count.followers;

  return (
    <Card className={styles.header()} render={<motion.div {...SLIDE_UP} transition={{ duration: 0.3, ease: EASE_OUT }} />}>
      <Avatar className={styles.avatar()}>
        <AvatarFallback className={styles.avatarFallback()}>{authorInitial}</AvatarFallback>
      </Avatar>
      <div className={styles.info()}>
        <h1 className={styles.name()}>{profile.name || "Anonymous"}</h1>
        <div className={styles.meta()}>
          <Badge variant="secondary" size="sm" className={styles.plan()}>
            {profile.plan.toLowerCase()}
          </Badge>
          <span className={styles.followers()}>
            <UsersGroupRoundedIcon className={styles.followersIcon()} aria-hidden="true" />
            {followers} {followers === 1 ? "follower" : "followers"}
          </span>
          <span className={styles.divider()} aria-hidden="true">
            ·
          </span>
          <span>{profile._count.following} following</span>
        </div>
      </div>
      {canFollow && (
        <Button
          variant={profile.isFollowing ? "outline" : "default"}
          className={styles.follow()}
          onClick={onFollowToggle}
          disabled={isFollowPending}
        >
          {profile.isFollowing ? "Unfollow" : "Follow"}
        </Button>
      )}
    </Card>
  );
}

function snippetsView(isLoading: boolean, count: number) {
  const isEmpty = count === 0;
  if (isLoading) {
    return SnippetsView.Loading;
  }
  if (isEmpty) {
    return SnippetsView.Empty;
  }
  return SnippetsView.Grid;
}

function SnippetsContent({ view, snippets }: SnippetsContentProps) {
  if (view === SnippetsView.Loading) {
    return (
      <motion.div {...FADE_IN} exit={profileMotion.fadeOut} className={styles.grid()} aria-busy="true">
        {profileMotion.skeletonKeys.map((key) => (
          <Skeleton key={key} className={styles.cardSkeleton()} />
        ))}
      </motion.div>
    );
  }

  if (view === SnippetsView.Empty) {
    return (
      <motion.div {...FADE_IN} exit={profileMotion.fadeOut}>
        <Card>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CodeSquareIcon aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No public snippets yet.</EmptyTitle>
              <EmptyDescription>Snippets this creator publishes will show up here.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div {...FADE_IN} exit={profileMotion.fadeOut} className={styles.grid()}>
      {snippets.map((snippet, i) => (
        <ExploreSnippetCard key={snippet.id} snippet={snippet} index={i} isPinned={!!snippet.pinnedAt} />
      ))}
    </motion.div>
  );
}

export default function ProfilePageClient({ userId }: ProfilePageClientProps) {
  const { user: currentClerkUser } = useUser();
  const { data: profile, isLoading: profileLoading } = useUserProfile(userId);
  const { data: snippetsData, isLoading: snippetsLoading } = useSnippetExplore({ limit: 12, userId });
  const { trigger: toggleFollow, isMutating: isFollowPending } = useToggleFollow(userId);

  const snippets = snippetsData?.snippets ?? [];
  const view = snippetsView(snippetsLoading, snippets.length);

  async function handleFollowToggle() {
    const hasProfile = Boolean(profile);
    if (!hasProfile) {
      return;
    }
    await toggleFollow();
  }

  const isMissing = !profile;
  if (profileLoading) {
    return <ProfileSkeleton />;
  }
  if (isMissing) {
    return <ProfileNotFound />;
  }

  const canFollow = !profile.isOwnProfile && Boolean(currentClerkUser);

  return (
    <View className={styles.scroll()}>
      <View className={styles.root()}>
        <ProfileHeader
          profile={profile}
          canFollow={canFollow}
          isFollowPending={isFollowPending}
          onFollowToggle={handleFollowToggle}
        />
        <motion.section
          {...SLIDE_UP}
          transition={{ duration: 0.3, delay: 0.1, ease: EASE_OUT }}
          className={styles.section()}
        >
          <h2 className={styles.sectionTitle()}>Public Snippets</h2>
          <AnimatePresence mode="wait">
            <SnippetsContent key={view} view={view} snippets={snippets} />
          </AnimatePresence>
        </motion.section>
      </View>
    </View>
  );
}
