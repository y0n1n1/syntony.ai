import GradientText from "../custom/GradientLogo"

const FullFooter = () => {
  return (
    <div>
        <footer className="w-screen">
            <hr className="h-1"/>
            <nav className="flex align-middle items-center justify-center p-4 flex-row ">
                
                <img src="public/assets/TEXT_LOGO.svg" alt="logo"
                    className="mx-3 object-cover h-14 w-17 px-20" />
                
                <div className=" w-5/12 sm:w-420 flex-left flex-col items-left text-left ">
                    <p className="text-base text-stone-600 mb-3">A free research engine that seeks to aid ML researchers, increase their clarity, give them <GradientText/>. We keep you updated on the research that matters to you, and accelerates the research process through an innovative AI-powered research system.</p>
                    <p className="text-base text-stone-600 mb-3">© 2024 Syntony, Inc.</p>
                </div>
            </nav>
        </footer>
    </div>
  )
}

export default FullFooter