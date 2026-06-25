"use client";

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";
import { Card, Form, TextField, Input, Label, Button, FieldError } from "@heroui/react"; 
import { FaCamera, FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { Check } from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/utils/uploadImage";

import districtsData from "@/data/districts.json";
import upazilasData from "@/data/upazilas.json";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const SignUp = () => {
    const router = useRouter();
    const [preview, setPreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
    
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [filteredUpazilas, setFilteredUpazilas] = useState([]);
const districts =
  districtsData.find((item) => item.type === "table")?.data || [];

const upazilas =
  upazilasData.find((item) => item.type === "table")?.data || [];
    useEffect(() => {
    if (selectedDistrict) {
        const filtered = upazilas.filter(
            (u) => u.district_id === selectedDistrict
        );

        setFilteredUpazilas(filtered);
    } else {
        setFilteredUpazilas([]);
    }
}, [selectedDistrict]);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const user = Object.fromEntries(formData.entries());

        if (user.password !== user.confirm_password) {
            toast.error("Passwords do not match!");
            setLoading(false);
            return;
        }

        let imageUrl = "";
        if (imageFile) {
            try {
                imageUrl = await uploadImage(imageFile);
            } catch (uploadErr) {
                toast.error("Image upload failed!");
                setLoading(false);
                return;
            }
        } else {
            toast.error("Please upload an avatar first");
            setLoading(false);
            return;
        }

        try {
            const districtName =
  districts.find((d) => d.id === user.district)?.name || "";

const upazilaName =
  upazilas.find((u) => u.id === user.upazila)?.name || "";

            const { data, error } = await authClient.signUp.email({
                name: user.name,
                email: user.email,
                image: imageUrl,
                password: user.password,
                bloodGroup: user.bloodGroup,
  district: districtName,
  upazila: upazilaName,
  role: "donor",
  status: "active",
                callbackURL: "/signin",
            });
console.log("signup data:", data);
            if (error) {
                toast.error(error.message);
                setLoading(false);
                return;
            }
await authClient.signOut();
            toast.success("✅ Sign Up Successful as Donor!");
            router.push("/login");
        } catch (err) {
            toast.error("❌ Sign Up Failed!");
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 py-12 px-4 flex items-center justify-center">
            <Card className="w-full max-w-xl bg-slate-900 border border-white/5 py-8 px-6 sm:px-8 shadow-2xl rounded-2xl">
                <h1 className="text-center text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-indigo-400 mb-2">Sign Up</h1>
                <p className="text-center text-slate-400 text-sm mb-8">Create an account to start sharing your ideas and collaborating with others.</p>

                <Form onSubmit={onSubmit} className="flex w-full flex-col gap-5">
                    
                    {/* Image Profile Upload */}
                    <div className="flex flex-col items-center gap-3 mb-4 w-full">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-pink-500 shadow-lg bg-slate-800">
                                {preview ? (
                                    <img src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <FaUser size={32} />
                                    </div>
                                )}
                            </div>
                            <label htmlFor="image" className="absolute bottom-0 right-0 bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-full cursor-pointer shadow-lg transition">
                                <FaCamera size={12} />
                            </label>
                        </div>
                        <input id="image" name="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        <p className="text-xs text-slate-400">Upload your profile picture</p>
                    </div>

                    {/* Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <TextField isRequired name="name" type="text" className="dark">
                            <Label className="text-slate-300 text-xs font-semibold">Name</Label>
                            <Input placeholder="Enter your name" className="bg-slate-950/50" />
                            <FieldError className="text-xs text-red-400" />
                        </TextField>

                        <TextField isRequired name="email" type="email" className="dark">
                            <Label className="text-slate-300 text-xs font-semibold">Email</Label>
                            <Input placeholder="Enter your email" className="bg-slate-950/50" />
                            <FieldError className="text-xs text-red-400" />
                        </TextField>
                    </div>

                    {/* Dropdowns (Unification of Arrays to completely fix React keys warning) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-slate-300 text-xs font-semibold">Select Blood Group *</label>
                            <select required name="bloodGroup" defaultValue="" className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-3 h-10 text-sm text-white focus:outline-none focus:border-pink-500/50 transition">
                                <option value="" disabled className="bg-slate-900 text-slate-500">Choose group</option>
                                {bloodGroups.map((g) => <option key={`blood-${g}`} value={g} className="bg-slate-900 text-white">{g}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-slate-300 text-xs font-semibold">Select District *</label>
                            <select required name="district" defaultValue="" className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-3 h-10 text-sm text-white focus:outline-none focus:border-pink-500/50 transition" onChange={(e) => setSelectedDistrict(e.target.value)}>
                                <option value="" disabled className="bg-slate-900 text-slate-500">Choose district</option>
{districts.map((d) => (
    <option key={d.id} value={d.id} className="bg-slate-900 text-white">
        {d.name}
    </option>
))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-slate-300 text-xs font-semibold">Select Upazila *</label>
                        <select required name="upazila" defaultValue="" disabled={!selectedDistrict} className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-3 h-10 text-sm text-white focus:outline-none focus:border-pink-500/50 transition disabled:opacity-50">
                            <option value="" disabled className="bg-slate-900 text-slate-500">Choose upazila</option>
    {filteredUpazilas.map((u) => (
    <option key={u.id} value={u.id} className="bg-slate-900 text-white">
        {u.name}
    </option>
))}
                        </select>
                    </div>

                    {/* Passwords */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <TextField isRequired name="password" type={isShowPassword ? "text" : "password"} className="dark">
                            <Label className="text-slate-300 text-xs font-semibold">Password</Label>
                            <div className="relative">
                                <Input placeholder="Enter your password" className="bg-slate-950/50" />
                                <button type="button" onClick={() => setIsShowPassword(!isShowPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-slate-400">
                                    {isShowPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </TextField>

                        <TextField isRequired name="confirm_password" type={isShowConfirmPassword ? "text" : "password"} className="dark">
                            <Label className="text-slate-300 text-xs font-semibold">Confirm Password</Label>
                            <div className="relative">
                                <Input placeholder="Re-enter your password" className="bg-slate-950/50" />
                                <button type="button" onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-slate-400">
                                    {isShowConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </TextField>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <Button className='flex-1 bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold h-11 rounded-xl shadow-lg' type="submit" isDisabled={loading}>
                            <Check /> {loading ? "Signing Up..." : "SignUp"}
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default SignUp;