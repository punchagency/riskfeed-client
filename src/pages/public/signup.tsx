import { Link } from 'react-router-dom';
import { FaHome, FaBriefcase } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Logo from '@/assets/images/logo.png'

const Signup = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-4xl">
                <div className="flex flex-col justify-center items-center mb-8">
                    <img src={Logo} alt="logo" width={112} />
                    <p className="text-gray-600 text-lg">Choose your account type</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Link to="/signup/homeowner">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:border-primary hover:shadow-md transition-shadow cursor-pointer h-full"
                        >
                            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <FaHome className="text-blue-600 text-xl" />
                            </div>
                            <h2 className="text-2xl font-semibold mb-3">Homeowner</h2>
                            <p className="text-gray-600 mb-4">
                                Find trusted contractors, manage your construction projects, and mitigate risks
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    Post project requirements
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    Get verified contractor matches
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    Track project progress & payments
                                </li>
                            </ul>
                        </motion.div>
                    </Link>

                    <Link to="/signup/contractor">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:border-primary hover:shadow-md transition-shadow cursor-pointer h-full"
                        >
                            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <FaBriefcase className="text-green-600 text-xl" />
                            </div>
                            <h2 className="text-2xl font-semibold mb-3">Contractor</h2>
                            <p className="text-gray-600 mb-4">
                                Get certified, find quality leads, and build your reputation on our platform
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-start">
                                    <span className="text-green-600 mr-2">•</span>
                                    Get Indigo certified
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-600 mr-2">•</span>
                                    Access pre-qualified homeowners
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-600 mr-2">•</span>
                                    Manage projects & financials
                                </li>
                            </ul>
                        </motion.div>
                    </Link>
                </div>

                <div className="text-center text-gray-600 mb-2">
                    Already have an account?{' '}
                    <Link to="/signin" className="text-primary hover:underline font-medium">
                        Sign In
                    </Link>
                </div>

                <div className="text-center text-gray-600">
                    Account not activated?{' '}
                    <Link to="/activate-account" className="text-primary hover:underline font-medium">
                        Activate it here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;