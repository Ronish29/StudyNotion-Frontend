import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import IconBtn from '../../common/IconBtn';

const VideoDetailsSidebar = ({setReviewModal}) => {

  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures
  } = useSelector ( (state) => state.viewCourse);

  const [activeStatus, setActiveStatus] = useState("");
  const [videoBarActive, setVideoBarActive] = useState("");
  const navigate= useNavigate();
  const location = useLocation();
  const { sectionId, subSectionId} = useParams();
  console.log(sectionId);
  console.log(subSectionId)
  
  

  useEffect(() => {
      const setActiveFlags = () => {
        if(!courseSectionData.length)
          return ;
        const currentSectionIndex =  courseSectionData.findIndex(
          (data) => data._id === sectionId
        )
        const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection.
        findIndex(
          (data) => data.id === subSectionId
        )
        const activeSubSectionId = courseSectionData[currentSectionIndex]?.subSection?.[currentSubSectionIndex]?._id;

        // set current section here
        setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);
        // set current sub-section here
        setVideoBarActive(activeSubSectionId);

      }
      setActiveFlags();
  }, [courseSectionData,courseEntireData, location.pathname]);

  return (
    <>
      <div>
        {/* for buttons and headings */}
        <div>
          {/* for buttons */}
          <div>
              <div 
              onClick={() => navigate("/dashboard/enrolled-courses")}
              >
                Back
              </div>
              <div>
                <IconBtn
                text="Add Review"
                onclick={() => setReviewModal(true)}
                />
              </div>
          </div>
          {/* for heading or title */}
          <div>
            <p>{courseEntireData?.courseName}</p>
            <p>{completedLectures?.length} / {totalNoOfLectures}</p>
          </div>

        </div>

        {/* for section and subsection */}
        <div>
          {
            courseSectionData.map((course, index) => {
              <div
              onclick={() => setActiveStatus(course?._id)}
              key={index}
              >
                {/* section */}
                <div>
                  <div>
                    {course?.sectionName}
                  </div>
                  {/*  */}
                </div>

                {/* subsection */}
                <div>
                  {
                      activeStatus === course?._id && (
                        <div >
                          {
                            course.subSection.map((topic, index) => {
                              <div
                              className={`flex gap-4 p-5 
                              ${videoBarActive === topic._id 
                                ? "bg-yellow-200 text-richblack-900" 
                                : "bg-richblack-900 text-white"}`}
                                key={index}
                                onclick={ ()=> {
                                  console.log(course?._id);
                                  navigate(`/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic._id}`)
                                  setVideoBarActive(topic?._id)
                                }}
                              >
                                <input 
                                type="checkbox"
                                checked = {completedLectures.includes(topic?._id)}
                                onChange={()=> {}}
                                />
                                <span>
                                  {topic.title}
                                </span>
                              </div>
                            })
                          }
                        </div>
                      )
                  }
                </div>
              </div>
            })
          }
        </div>
      </div>
    </>
  )
}

export default VideoDetailsSidebar