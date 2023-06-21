import React, { ComponentProps, PropsWithChildren, useEffect } from 'react';

import { Messages, readMessages } from '../Molecules/Messages';
import { Footer } from '../Organisms/Footer';
import Header from '../Organisms/Header';

export function Frame(
  props: PropsWithChildren<{
    header: ComponentProps<typeof Header>;
    footer: ComponentProps<typeof Footer>;
  }>,
) {
  const [messages, setMessages] = React.useState<Array<string>>([]);
  useEffect(() => {
    setMessages(readMessages());
  }, []);
  return (
    <div>
      <Header {...props.header} />
      <main>
        <Messages messages={messages} />
        {props.children}
      </main>
      <Footer {...props.footer} />
    </div>
  );
}
