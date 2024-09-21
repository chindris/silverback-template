import 'graphql-voyager/dist/voyager.css';

import { buildSchema } from 'graphql';
import { Voyager } from 'graphql-voyager';

import sdlString from '../node_modules/@custom/schema/build/schema.graphql?raw';

const schema = buildSchema(sdlString);

function App() {
  return (
    <>
      <Voyager introspection={schema} />
    </>
  );
}

export default App;
