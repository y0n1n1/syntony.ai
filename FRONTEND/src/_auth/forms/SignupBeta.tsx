import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const SignupBeta = () => {
    return (
        <div className="sm:w-420 flex-center flex-col items-center text-center">
            <h1 className="font-bold text-3xl mt-5 pb-2">Become a Beta Tester for Syntony</h1>
            <p className="text-base text-stone-600 mb-5">
                Before signing up as a beta tester, here’s what you should know.
            </p>

            <div className="w-96 mx-10 flex-left flex-col items-left text-left mb-10">
                <h2 className="text-xl font-semibold mb-3">What Does It Mean to Be a Beta Tester?</h2>
                <p className="text-stone-700 mb-4">
                    As a beta tester, you’ll get exclusive early access to Syntony’s ReSearch tool, allowing you to explore our advanced search engine to conduct your own research. 
                    This is your opportunity to freely navigate and experiment with the engine as you like, providing insights into its usability and functionality.
                </p>
                
                <h2 className="text-xl font-semibold mb-3">Your Feedback Matters</h2>
                <p className="text-stone-700 mb-4">
                    You’ll have the chance to chat with us directly about your experience, sharing your thoughts on what you love and what could be improved. 
                    Your feedback is crucial to enhancing Syntony and refining its design to better serve the research community.
                </p>

                <h2 className="text-xl font-semibold mb-3">Why Your Participation is Essential</h2>
                <p className="text-stone-700 mb-6">
                    Being a beta tester isn’t just about trying a new tool; it’s about contributing to a mission that aims to revolutionize the research process. 
                    Syntony’s mission is to accelerate research by creating a search tool that promotes clarity and precision. 
                    Your involvement helps us address the gaps in today’s research tools, from outdated designs to limited customization and inefficient results.
                </p>

                <p className="text-stone-700 mb-6">
                    Syntony was created with the understanding that researchers spend too much time finding and filtering papers. 
                    Our goal is to give you the tools to refine searches as much as you need, saving time and advancing research productivity.
                </p>
                <Link to="/sign-up-beta-form">
                <Button  className="mt-6">
                    Sign me in
                </Button></Link>
            </div>
        </div>
    );
};

export default SignupBeta;
