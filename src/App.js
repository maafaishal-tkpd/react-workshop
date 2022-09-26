import { Route, Switch } from 'react-router-dom';
import loadable from '@loadable/component';
import { Helmet } from 'react-helmet-async';

import Home from './Home';

import Todo from './Todo';
import Blog from './Blog';
import IntersectionObserver from './IntersectionObserver';

const CodeSplitting = loadable(() => import(/* webpackChunkName: 'code-splitting'*/ './CodeSplitting'));

const CodeSplittingIO = loadable(() => import(/* webpackChunkName: "code-splitting-io" */ './CodeSplittingIO'));

import './App.css';

const App = () => (
  <>
    <Helmet>
      <title>Hello World</title>
    </Helmet>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/todo" component={Todo} />
      <Route exact path="/blog" component={Blog} />
      <Route exact path="/code-splitting" component={CodeSplitting} />
      <Route exact path="/code-splitting-io" component={CodeSplittingIO} />
      <Route exact path="/io" component={IntersectionObserver} />
    </Switch>
  </>
);

export default App;
