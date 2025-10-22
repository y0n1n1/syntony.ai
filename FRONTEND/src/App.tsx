import { Routes, Route } from 'react-router-dom';
import './globals.css';
import AuthLayout from './_auth/AuthLayout';
import SignupForm from './_auth/forms/SignupForm';
import SigninForm from './_auth/forms/SigninForm';
import RootLayout from './_root/RootLayout';
import SearchLayout from './_search/SearchLayout';
import Settings from './_root/pages/core/Settings';
import Home from './_search/pages/Home';
import Search from './_search/pages/Search';
import Mission from './_static/pages/Mission';
import Privacy from './_static/pages/Privacy';
import Terms from './_static/pages/Terms';
import StaticLayout from './_static/StaticLayout';
import NotFound from './_static/pages/NotFound'; // Import a NotFound component

import { AuthProvider, useAuth } from './api/authContext';
import HeroLayout from './hero/HeroLayout';
import Landing from './hero/pages/Landing';
import Saved from './_search/pages/Saved';
import Message from './_search/pages/Message';
import NoScrollSearchLayout from './_search/NoScrollSearchLayout';
import SavedFolder from './_search/pages/SavedFolder';
import History from './_search/pages/History';
import { SearchProvider } from './_search/searchProvider';
import ArticlePage from './_search/pages/Article';
import AuthorPage from './_search/pages/Author';
import TopicPage from './_search/pages/Topic';
import Updates from './hero/pages/updates';

// const { user, logout } = useAuth(); // Access user and logout function

const App = () => {
    return (
        <main className='flex h-screen'>
            <AuthProvider>
                <SearchProvider>
                <Routes>
                    {/* Private Routes */}
                    {/* Private Routes */}
                    <Route element={<StaticLayout />}>
                        <Route path="mission" element={<Mission />} />
                        <Route path="privacy-policy" element={<Privacy />} />
                        <Route path="terms-of-service" element={<Terms />} />
                        {/* Catch-All for 404 */}
                        <Route path="*" element={<NotFound />} />
                    </Route>
                    {/* Public Routes */}
                    <Route element={<AuthLayout />}>
                        <Route path="sign-up" element={<SignupForm />} />
                        <Route path="sign-in" element={<SigninForm />} />
                    </Route>
                    {/* Private Routes */} 
                    <Route element={<SearchLayout />}>
                        <Route path="search" element={<Search />} />
                        <Route path="saved" element={<Saved/>} />
                        <Route path="saved/:id" element={<SavedFolder/>} />
                        <Route path="message-beta" element={<Message/>} />
                        <Route path="history" element={<History/>} />
                        <Route path="article/:id" element={<ArticlePage/>}/>
                        <Route path="author/:id" element={<AuthorPage/>}/>
                        <Route path="topic/:id" element={<TopicPage/>}/>
                    </Route>

                    <Route element={<NoScrollSearchLayout />}>
                        <Route path="/home" element={<Home />} />
                    </Route> 
                    <Route element={<HeroLayout />}>
                        <Route path="/" element={<Landing  />} />
                        <Route path="/updates" element={<Updates  />} />
                        <Route path="/landing" element={<Landing  />} />
                    </Route>
                    <Route element={<RootLayout />}>
                        <Route path="settings" element={<Settings />} />
                    </Route>
                </Routes>
                </SearchProvider>
            </AuthProvider>
        </main>
    );
}

export default App;
