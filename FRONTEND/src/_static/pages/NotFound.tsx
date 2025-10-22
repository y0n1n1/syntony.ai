
import GradientText from '@/components/custom/GradientLogo';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className='ml-56 flex flex-row justify-start mt-12'>
      <div className='w-6/12'>
        <h1 className='text-4xl font-semibold pb-6 text-stone-800'>
          <GradientText /> - 404 Error Page Not Found
        </h1>
        <p className='text-stone-600'>Oops! The page you are looking for does not exist.</p>
        <p className='py-4'>
          It might have been removed, renamed, or did not exist in the first place.
        </p>
        <p className='py-4'>
          You can go back to the <Link to="/" className="text-blue-500 underline">home page</Link> or check the links below:
        </p>
        <ul className='list-disc pl-5'>
          <li><Link to="/sign-up" className="text-blue-500 underline">Sign Up</Link></li>
          <li><Link to="/sign-in" className="text-blue-500 underline">Sign In</Link></li>
          <li><Link to="/mission" className="text-blue-500 underline">Mission</Link></li>
          <li><Link to="/search" className="text-blue-500 underline">Search</Link></li>
        </ul>
      </div>
      <div className='ml-32'>
        <h1 className='font-light text-stone-600 text-2xl mb-5'>Helpful Links</h1>
        <p className='my-3 font-medium'>
          - Check our <Link to="/privacy-policy" className="text-blue-500 underline">Privacy Policy</Link>
        </p>
        <p className='my-3 font-medium'>
          - Review our <Link to="/terms-of-service" className="text-blue-500 underline">Terms of Service</Link>
        </p>
      </div>
    </div>
  );
}

export default NotFound;
