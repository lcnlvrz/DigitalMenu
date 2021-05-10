import React from 'react';
import { Link } from 'react-router-dom';

const SurveyFormOptionsNavigator = () => {
    return (
        <section className="flex flex-margin-children flex-row flex-wrap w-full variable-height items-center justify-evenly">
            <div className="shadow-2xl flex flex-col justify-between p-5 bg-white items-start h-64 w-64">
                <div>
                    <h2 className={`text-red-500 font-semibold`}>Results</h2>
                    <p className="text-gray-400 font-light w-52">See all customers responses to your survey forms</p>
                </div>
                <Link to="/dashboard/survey-forms/responses">
                    <button
                        className={`bg-red-500 font-semibold py-2 px-4 text-white hover:bg-white border-2 border-red-500 border-opacity-0 hover:border-opacity-100 hover:text-red-500 transition-all`}
                    >
                        Responses
                    </button>
                </Link>
            </div>
            <div className="shadow-2xl flex flex-col justify-between p-5 bg-white items-start h-64 w-64">
                <div>
                    <h2 className={`text-blue-500 font-semibold`}>Survey Forms</h2>
                    <p className="text-gray-400 font-light w-52">
                        Create, edit, delete, public, customize and manage all your survey forms.
                    </p>
                </div>
                <Link to="/dashboard/survey-forms/created">
                    <button
                        className={`bg-blue-500 font-semibold py-2 px-4 text-white hover:bg-white border-2 border-blue-500 hover:text-blue-500 border-opacity-0 hover:border-opacity-100 transition-all`}
                    >
                        Survey Forms
                    </button>
                </Link>
            </div>
        </section>
    );
};

export default SurveyFormOptionsNavigator;
