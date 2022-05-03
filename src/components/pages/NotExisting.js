import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import {CheckoutForm} from "../CheckoutForm";

import '../../App.css'

const stripePromise = loadStripe("pk_test_51ELPw0GnhsO4RtFa7HIILjcjS8WMtFTtPk7NkTZJtQS4r4fySmUFsaQdNWS0WvcBrPygfHn2D97wgL1I9Wwnoaek00ATsqQQSM");

export default function HomePage() {

}