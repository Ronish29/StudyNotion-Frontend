import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux'
import ReactStars from "react-rating-stars-component";
import IconBtn from '../../common/IconBtn';
import { createRating } from '../../../services/operations/courseDetailsAPI';

const CourseReviewModal = ({setReviewModal}) => {

    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);
    const { courseEntireData} = useSelector((state) => state.viewCourse);
    
    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors},
    } = useForm();

    useEffect(()=>{
        setValue("courseExperience","");
        setValue("courseRating", 0);

    },[]);

    const onSubmit = async(data) =>{
        await createRating(
            {
                courseId: courseEntireData._id ,
                rating: data.courseRating,
                review: data.courseExperience,
            },
            token
        )
        setReviewModal(false);
    }
    const ratingChanged = (newRating) =>{
        setValue("courseRating",newRating)
    }


    return (
        <div>
            <div>
                {/* Modal header */}
                <div>
                    <p>Add review</p>
                    <button
                    onClick={setReviewModal(false)}
                    >
                        close
                    </button>

                </div>

                {/* modal body */}
                <div>
                    <div>
                        <img src={user?.image} alt="user Image"
                        className='aspect-square w-[50px] rounded-full object-cover' />
                        <div>
                            <p>{user?.firstName} {user?.lastName}</p>
                            <p>Posting publically</p>

                        </div>
                    </div>

                    <form 
                    onSubmit={handleSubmit(onSubmit)}
                    className='mt-6 flex flex-col items-center'
                    >
                    <ReactStars
                    count={5}
                    onChange={ratingChanged}
                    size={24}
                    activeColor="#ffd700"
                    />

                    <div>
                        <label htmlFor="courseExperience">
                            Add your experience
                        </label>
                        <textarea 
                        id="courseExperience"
                        placeholder='Add your experience'
                        {...register("courseExperience",{required:true})}
                        className='form-style min-h-[130px] w-full'
                        />
                        {
                            errors.courseExperience && (
                                <span>Add your experience</span>
                            )
                        }


                    </div>

                    {/* cancel and save button */}
                    <div>
                        <button
                        onClick={()=>setReviewModal(false)}
                        >
                            Cancel
                        </button>
                        <IconBtn
                        text="Save"
                        />
                    </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default CourseReviewModal