import '@root/global.scss';
import '@root/animations.scss';

import { SectionLanding } from '@sections/SectionLanding';
import { getMetadata } from '@utils/getMetadata';

export const metadata = getMetadata({
  title: "Debug Contracts",
  description: "Debug your deployed 🏗 Scaffold-ETH 2 contracts in an easy way",
});

export default async function Page(props) {
  return (
    <SectionLanding />
  );
}
