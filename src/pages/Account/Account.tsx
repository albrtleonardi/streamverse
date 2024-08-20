import MainLayout from "../../layouts/MainLayout";
import { useUser } from "@/context/UserContext";
import ProfilePictureUploader from "./ProfilePictureUploader";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePicker } from "@/components/ui/datepicker";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/config/constants";
import axios from "axios";
import { useToaster } from "@/context/ToastContext";

const Account = () => {
  const [user, fetchUser] = useUser();

  if (!user) {
    return null;
  }

  const [fullName, setFullName] = useState<string>(user.profile.full_name);
  const [email, setEmail] = useState<string>(user.email);
  const [bio, setBio] = useState<string>(user.profile.bio);
  const [gender, setGender] = useState<string>(user.profile.gender || "");
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(
    user.profile.date_of_birth
      ? new Date(user.profile.date_of_birth)
      : undefined
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toastSuccess, toastError } = useToaster();

  const handleUploadSuccess = () => {
    fetchUser();
  };

  const saveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const utcDateOfBirth = dateOfBirth
        ? new Date(
            dateOfBirth.getTime() - dateOfBirth.getTimezoneOffset() * 60000
          )
        : null;

      const response = await axios.patch(
        `${BASE_URL}/account/update-profile`,
        {
          full_name: fullName,
          email,
          bio,
          gender,
          date_of_birth: utcDateOfBirth,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toastSuccess("Profile updated successfully");
        fetchUser();
      }
    } catch (error: any) {
      toastError("Something went wrong. Please try again later.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="px-4 md:px-8 py-8">
        <p className="text-3xl text-black font-bold">Your Account</p>
        <br />
        <div className="flex flex-col gap-4">
          <p className="text-xl text-black font-semibold">Profile Picture</p>
          <ProfilePictureUploader
            user={user}
            onUploadSuccess={handleUploadSuccess}
          />
        </div>
        <br />
        <br />
        <div className="flex flex-col gap-4">
          <p className="text-xl text-black font-semibold">Profile Settings</p>
          <form
            onSubmit={saveChanges}
            className="border flex flex-col gap-6 p-4 md:p-8 rounded-md bg-white border-purple-500 w-full max-w-full md:max-w-[75%]"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <p className="text-lg text-black font-semibold min-w-48">
                Full Name
              </p>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <p className="text-lg text-black font-semibold min-w-48">Email</p>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <p className="text-lg text-black font-semibold min-w-48">Bio</p>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-col md:flex-row items-start gap-4">
              <p className="text-lg text-black font-semibold min-w-48">
                Gender
              </p>
              <RadioGroup
                className="flex flex-row gap-4"
                value={gender}
                onValueChange={(value) => setGender(value)}
              >
                <label className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="Male"
                    id="male"
                    className="border-purple-500 text-purple-500 focus-visible:ring-purple-500"
                  />
                  <span>Male</span>
                </label>
                <label className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="Female"
                    id="female"
                    className="border-purple-500 text-purple-500 focus-visible:ring-purple-500"
                  />
                  <span>Female</span>
                </label>
              </RadioGroup>
            </div>
            <div className="flex flex-col md:flex-row items-start gap-4">
              <p className="text-lg text-black font-semibold min-w-48">
                Date of Birth
              </p>
              <DatePicker date={dateOfBirth} setDate={setDateOfBirth} />
            </div>
            <div className="w-full flex justify-end items-center gap-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button
                disabled={loading}
                className="bg-purple-500 hover:bg-purple-600 px-6"
              >
                <span>Save Changes</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default Account;
