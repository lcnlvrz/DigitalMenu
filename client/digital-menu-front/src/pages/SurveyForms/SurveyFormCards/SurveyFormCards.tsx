import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { Typography, Switch, Spin, Tooltip } from 'antd';
import moment from 'moment';
import React from 'react';
import { FcSurvey } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import { useSurveyForms } from '../../../controllers/survey-forms.controller';

const SurveyFormCards = () => {
    const controller = useSurveyForms();

    const addForm = (
        <Link to="/dashboard/survey-forms/create">
            <div className="border hover-parent cursor-pointer space-y-3 rounded border-dashed transition-all border-gray-300 hover:border-gray-700 p-2 h-56 w-56 flex flex-col items-center hover:border-gray- justify-center">
                <PlusOutlined className="text-2xl" />
                <button className="text-lg transition-all text-gray-500 bg-white shadow-xl p-2 rounded children-of-hover-parent">
                    Add Form
                </button>
            </div>
        </Link>
    );

    if (controller.isLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <Spin />
            </div>
        );
    }

    return (
        <div className="p-5">
            <div className="flex flex-row space-x-3 items-center">
                <Link to="/dashboard/survey-forms">
                    <Tooltip title="Back">
                        <button className="bg-transparent active:outline-none focus:outline-none">
                            <ArrowLeftOutlined className="back-arrow transition-all cursor-pointer" />
                        </button>
                    </Tooltip>
                </Link>
                <h1 className="text-lg m-0 text-gray-800"> Survey Form Creator </h1>
            </div>
            <section className="flex flex-row w-full items-start justify-start 600:justify-center flex-wrap gap-4 p-5">
                {addForm}
                {controller.restaurant.surveyForms?.length
                    ? controller.restaurant.surveyForms.map((form, index) => (
                          <div
                              key={index}
                              className="border hover-parent cursor-pointer items-start space-y-3 rounded border-dashed transition-all border-gray-300 hover:border-gray-700 p-2 h-56 w-56 flex flex-col justify-center"
                          >
                              <div className="w-full flex items-center justify-center h-full relative">
                                  <div className="h-full w-full bg-gray-300 flex items-center justify-center">
                                      <FcSurvey className="text-8xl" />
                                  </div>
                                  <div className="absolute z-10 top-0 change-bg-on-hover-parent bottom-0 flex flex-row items-center justify-center left-0 right-0 transition-all">
                                      <Link to={'/dashboard/survey-forms/edit?id=' + form.id}>
                                          <button className="bg-red-500 px-4 text-white show-on-hover font-semibold py-1 hover:bg-red-800 transition-all hidden text-lg rounded">
                                              Edit
                                          </button>
                                      </Link>
                                  </div>
                              </div>
                              <div className="w-full flex flex-row justify-between">
                                  <div className="flex flex-col items-start">
                                      <Typography.Paragraph
                                          className="font-light"
                                          style={{ margin: 0 }}
                                          ellipsis={{ rows: 1 }}
                                      >
                                          {form.questions.length} {form.questions.length > 1 ? 'questions' : 'question'}
                                      </Typography.Paragraph>
                                      <p className="font-light" style={{ margin: 0 }}>
                                          {moment(form.createdAt).format('LL')}
                                      </p>
                                  </div>
                                  <Switch
                                      onChange={(checked) =>
                                          controller.updateSurveyForm(form.id, { isPublic: checked }, form)
                                      }
                                      checked={form.isPublic}
                                      unCheckedChildren="Hidden"
                                      checkedChildren="Public"
                                  />
                              </div>
                          </div>
                      ))
                    : null}
            </section>
        </div>
    );
};

export default SurveyFormCards;
