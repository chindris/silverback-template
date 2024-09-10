import 'graphql-voyager/dist/voyager.css';

import { buildSchema } from 'graphql';
import { Voyager } from 'graphql-voyager';

import sdlString from '../../../packages/schema/build/schema.graphql?raw';

const schema = buildSchema(sdlString);

function App() {
  return (
    <>
      <Voyager introspection={schema} />
    </>
  );
}

export default App;
