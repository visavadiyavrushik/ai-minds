import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { ReactComponent as BackArrow } from "../../assets/back.svg";
import { ReactComponent as PasswordSvg } from "../../assets/password.svg";
import CommonLayout from "../../layout/AuthLayout";
import InputWithIcon from "../../components/InputWithIcon";
import resetPasswordSchema from "../../validators/resetPasswordSchema";
import { AuthApi } from "../../services/apis/AuthApis";
import { Toast } from "../../utils/Toasts";
import ButtonWithLoader from "../../components/ButtonWithLoader";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toastShownRef = useRef(false);

  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (!token && !toastShownRef.current) {
      Toast.error("Token is missing or invalid.");
      toastShownRef.current = true;
      setTimeout(() => navigate("/forgot-password"), 1000);
    } else {
      setToken(token);
    }
  }, [navigate, location.search]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const updatedData = {
        ...data,
        token,
      };
      const response = await AuthApi.resetPassword(updatedData);
      Toast.success(response.message);
      setTimeout(() => navigate("/signin"), 1500);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CommonLayout>
      <div className="col-span-7 lg:col-span-3  bg-black text-white flex justify-center items-center lg:items-start flex-col h-screen order-0 lg:order-1 px-3 lg:px-0">
        <div className="w-full max-w-[430px] pl-[0px] lg:ml-[40px] 2xl:ml-[140px] pr-0 md:pr-10 xl:pr-0">
          <div className="mb-8">
            <button className="mb-4" onClick={() => navigate(-1)}>
              <BackArrow />
            </button>
            <h1 className="text-4xl text-center lg:text-left font-extrabold mb-2">
              Ready to Use AI50?
            </h1>
            <p className="text-lg text-center lg:text-left ">Reset Password</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputWithIcon
              icon={PasswordSvg}
              placeholder="New Password"
              type="password"
              {...register("password")}
              error={errors.password?.message}
              isPassword={true}
            />
            <InputWithIcon
              icon={PasswordSvg}
              placeholder="Confirm New Password"
              type="confirmPassword"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
              isPassword={true}
            />
            <ButtonWithLoader isLoading={isLoading} disabled={isLoading}>
              Reset
            </ButtonWithLoader>
          </form>
          <p className="mt-8 text-lg">
            By signing up, you agree to the{" "}
            <Link to="#" className="underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="#" className="underline">
              Privacy Policy
            </Link>
            .
          </p>

          <p className="my-10 border-t border-gray-400 text-sm text-center"></p>
          <p className="text-lg font-semibold">
            <Link to="/signin" className="underline text-customGreen">
              {""}
              Sign in{""}
            </Link>{" "}
            &nbsp;If you have an account
          </p>
        </div>
      </div>
    </CommonLayout>
  );
};

export default ResetPassword;
