import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Breadcrumb, Form, Input, Select, Checkbox, Rate, Radio, Spin } from 'antd';
import { TypesQuestion, useCreateSurveyForm } from '../../../controllers/create-survey-form.controller';
import './CreateSurveyForm.css';
import { BiHappy, BiMeh, BiSad } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

const CreateSurveyForm = () => {
    const controller = useCreateSurveyForm();

    const isMax500 = useMediaQuery({ maxWidth: '500px' });

    const rating = (
        <div className="flex items-center justify-center h-full">
            <Rate defaultValue={5} disabled />
        </div>
    );

    const smile = (
        <div className="flex flex-row space-x-3 items-center justify-center h-full text-2xl text-gray-600">
            <BiSad />
            <BiMeh />
            <BiHappy />
        </div>
    );

    const yesOrNo = (
        <div className="flex flex-row space-x-3 items-center justify-center h-full">
            <Radio.Group value="yes">
                <Radio value="yes">Yes</Radio>
                <Radio value="no">No</Radio>
            </Radio.Group>
        </div>
    );

    return (
        <section className="flex flex-col space-y-10 w-full p-5">
            <Breadcrumb>
                <Breadcrumb.Item
                    key="1"
                    className="hover:text-blue-500 cursor-pointer transition-all"
                    onClick={() => controller.history.push('/dashboard/survey-forms/created')}
                >
                    Survey Forms
                </Breadcrumb.Item>
                <Breadcrumb.Item key="2"> Create </Breadcrumb.Item>
            </Breadcrumb>
            <Form className="flex flex-col space-y-10" onFinish={controller.saveSurveyform} layout="vertical">
                <div className="flex flex-col items-start space-y-6">
                    <input
                        required
                        onChange={(e) =>
                            controller.setNameAndHeader((prevState) => ({ ...prevState, name: e.target.value }))
                        }
                        name="name"
                        value={controller.nameAndHeader.name}
                        className="w-80 500:w-full input-placeholder-text-lg transition-all border-b-2 border-gray-200 focus:border-blue-800 bg-transparent outline-none text-lg"
                        placeholder="Add Form Name"
                    />
                    <input
                        required
                        onChange={(e) =>
                            controller.setNameAndHeader((prevState) => ({ ...prevState, header: e.target.value }))
                        }
                        name="header"
                        value={controller.nameAndHeader.header}
                        className="input-placeholder-text-lg 500:w-full w-80 border-b-2 focus:border-blue-800 border-gray-200 transition-all bg-transparent outline-none text-lg"
                        placeholder="Add Form Header"
                    />
                </div>
                <div className="flex flex-col items-start relative space-y-5">
                    {controller.isLoading && (
                        <div className="bg-color-default transition-all m-0 p-0 absolute z-30 loader flex items-center justify-center w-full h-full">
                            <Spin />
                        </div>
                    )}
                    {controller.questions.length
                        ? controller.questions.map((question, index) => (
                              <div
                                  key={index}
                                  className="w-full flex-parent-margin-children flex flex-row flex-wrap items-start p-5 border border-gray-300"
                              >
                                  <div className="flex 500:w-full flex-col items-center space-y-2">
                                      <Input
                                          required
                                          onChange={(e) => controller.onChangeQuestion(index, e.target.value)}
                                          value={question.value}
                                          style={{ width: isMax500 ? '100%' : '15rem' }}
                                          placeholder="Type your question *"
                                      />
                                      <div style={{ width: isMax500 ? '100%' : '15rem' }} className="w-32 h-8">
                                          {(() => {
                                              switch (question.type) {
                                                  case TypesQuestion.RATING:
                                                      return rating;
                                                  case TypesQuestion.SMILEY:
                                                      return smile;
                                                  case TypesQuestion.YES_OR_NO:
                                                      return yesOrNo;
                                              }
                                          })()}
                                      </div>
                                  </div>
                                  <div className="flex flex-row space-x-3 items-start">
                                      <span className="font-light mt-1"> Question Type </span>
                                      <Select
                                          onChange={(value) => controller.onChangeType(index, value.value)}
                                          style={{ width: '5.5rem' }}
                                          labelInValue
                                          value={{
                                              value: question.type,
                                              label: question.type,
                                          }}
                                      >
                                          <Select.Option className="capitalize" value={TypesQuestion.SMILEY}>
                                              Smiley
                                          </Select.Option>
                                          <Select.Option value={TypesQuestion.RATING}>Rating</Select.Option>
                                          <Select.Option value={TypesQuestion.YES_OR_NO}>Yes/No</Select.Option>
                                          <Select.Option value={TypesQuestion.TEXT}>Text</Select.Option>
                                      </Select>
                                  </div>
                                  <div className="flex flex-row items-center space-x-3">
                                      <span className="font-light mt-1"> Mandatory Question </span>
                                      <Checkbox
                                          onChange={(e) => controller.onChangeMandatory(index, e.target.checked)}
                                          checked={question.isMandatoryQuestion}
                                          name="mandatoryQuestion"
                                      />
                                  </div>
                                  <button
                                      onClick={() => controller.removeQuestion(index)}
                                      style={{ marginLeft: '30px', marginTop: '15px' }}
                                      className="text-red-400 hover:text-red-700 hover:underline font-semibold transition-all cursor-pointer mt-2"
                                  >
                                      Delete
                                  </button>
                              </div>
                          ))
                        : null}
                </div>
                <Form.Item>
                    <div className="flex flex-col items-start">
                        {!controller.questions.length && <h3 className="text-lg"> Start Adding your questions </h3>}
                        <button
                            type="button"
                            onClick={controller.addQuestion}
                            className="bg-red-500 my-5 text-white font-semibold flex flex-row space-x-2 items-center p-2 hover:bg-red-800 transition-all shadow-xl"
                        >
                            <PlusOutlined />
                            <span>Add question</span>
                        </button>
                    </div>
                </Form.Item>
                <div className="flex items-center flex-row space-x-3 justify-center w-full">
                    <Form.Item style={{ margin: 0 }}>
                        <button
                            disabled={!controller.questions.length}
                            type="submit"
                            className={`${
                                !controller.questions.length ? 'opacity-50' : 'opacity-100'
                            } bg-red-500 my-5 w-20 justify-center text-white font-semibold flex flex-row space-x-2 items-center p-2 hover:bg-red-800 transition-all`}
                        >
                            Save
                        </button>
                    </Form.Item>
                    <Link to="/dashboard/survey-forms">
                        <button
                            type="button"
                            className="bg-white my-5 text-center w-20 text-black font-semibold flex justify-center space-x-2 items-center p-2 hover:bg-gray-300 transition-all"
                        >
                            Back
                        </button>
                    </Link>
                </div>
            </Form>
        </section>
    );
};

export default CreateSurveyForm;
