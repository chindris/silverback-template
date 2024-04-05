import React from 'react';

import { PageTransition } from '../Molecules/PageTransition';
import { UserProfile as UserProfileOrganism } from '../Organisms/UserProfile';

export function UserProfile(props: any) {
  return (
    <PageTransition>
      <UserProfileOrganism {...props} />
    </PageTransition>
  );
}
