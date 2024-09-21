import toast from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import rzpLogo from '../../assets/Logo/Logo-Full-Dark.png'
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";


const { COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API} = studentEndpoints;

function loadScript(src){
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true)
        }

        script.onerror= () => {
            resolve(false);
        }

        document.body.appendChild(script);
        console.log("script added");
    })
}

export async function buyCourse (token, courses, userDetails, navigate, dispatch) {
    console.log("buyCourse using dispatch called");
    const toastId = toast.loading("Loading...");
    console.log("Dispatch type:", typeof dispatch);

    try {
        // load the script 
        const response = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        console.log("Api called");

        if(!response){
            toast.error("Razorpay sdk failed to load");
            return;
        }
        console.log(response);
        //initiate the order
        const orderResponse = await apiConnector("POST",COURSE_PAYMENT_API, 
                            {courses},
                            {
                                Authorization : `Bearer ${token}`
                            })
        
        console.log("printing order response",orderResponse);

        if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message);
        }

        // options
        const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY,
            currency: orderResponse.data.message.currency,
            amount: `${orderResponse.data.message.amount}`,
            order_id: orderResponse.data.message.id ,
            name: "StudyNotion",
            description: "Thank for purchasing the course" ,
            image: rzpLogo ,
            prefill: {
                name : `${userDetails.firstName}`,
                email: userDetails.email
            } ,
            handler: function (response){
                // send successful mail
                sendPaymentSuccessEmail(response, orderResponse.data.message.amount,token);
                // verify payment
                verifyPayment({...response, courses}, token, navigate, dispatch)
            }
        }

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment field",function (response){
            toast.error("oops payment failed");
            console.log(response.error);
        })
        


    } catch (error) {
        console.log("Payment api error",error);
        toast.error("Could not make payment")
    }
    toast.dismiss(toastId);
}

async function sendPaymentSuccessEmail (response, amount, token){
    try {
        await apiConnector("POST",SEND_PAYMENT_SUCCESS_EMAIL_API,{
            orderId : response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount,
        },{
            Authorization: `Bearer ${token}`
        })
    } catch (error) {
        console.log("Payment success email error",error);
    }
}

// verify the payment
async function verifyPayment (bodyData,token, navigate, dispatch) {
    const toastId = toast.loading("Verifying the payment ...");
    dispatch(setPaymentLoading(true));
    try {
        const response = await apiConnector("POST",COURSE_VERIFY_API, bodyData,{
            Authorization: `Bearer ${token}`
        })

        if(!response.data.success){
            throw new Error(response.data.message)
        }

        toast.success("Payment successful, you are added to the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart())

    } catch (error) {
        console.log("Payment verify error",error)
        toast.error("could not verify the payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}