import SchoolTiming from "./components/SchoolTiming";
import PeriodsSection from "./components/PeriodsSection";
import SchoolLogo from "./components/SchoolLogo";
import { useEffect } from "react";
// import AddressSection from "./components/AddressSection";


import BasicInfo from "./components/BasicInfo";
import ContactInfo from "./components/ContactInfo";
import MarksSection from "./components/MarksSection";
import AcademicSession from "./components/AcademicSession";
import TollFree from "./components/TollFree";
import FAQSection from "./components/FAQSection";
import BannerSection from "./components/BannerSection";
import SocialLinks from "./components/SocialLinks";
import { useSchoolSettings } from "./hooks/useSchoolSettings";
import { Box, Button, Typography } from "@mui/material";
import Modal from "../../components/ui/Modal";
import Loader from "../../components/loader/Loader"


export default function SchoolSettings() {
    const SchoolId = localStorage.getItem("schoolId");
    console.log("SchoolId",SchoolId);
    const {
        schoolData,
        setSchoolData,
        handleChange,
        formatDateForInput,
        countryOptions,
        cityOptions,
        stateOptions,
        handleMarksChange,
        handleSocialChange,
        classOptions,
        academicYearOptions,
        runPeriodsValidation,
        getUsedMinutes,
        getSchoolTotalMinutes,
        getTimingStatus,
        availableOptions,
        logoPreview,
        setLogoPreview,
        getSocialLogoPreview,
        urlErrors,
        setUrlErrors,
        addSocial,
        resetMutation,
        mutation,
        academicYearFilter,
        setAcademicYearFilter,
        academicYearOptionss,
        setCordinateModalOpen,
        cordinateModalOpen,
        detectCurrentLocation,
        locationData,
        setLocationData,
        saveLocationMutation,
        getImagePreview,
        getPossibleLunchTimes,
        selectedSessionId,
        isLoading
    } = useSchoolSettings();
 const handleSubmit = (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append("academicSessionId", selectedSessionId); // 🔥 IMPORTANT

  formData.append(
    "schoolTiming",
    JSON.stringify(schoolData.schoolTiming)
  );

  formData.append(
    "periods",
    JSON.stringify(schoolData.periods)
  );

  if (schoolData.schoolLogo) {
    formData.append("schoolLogo", schoolData.schoolLogo);
  }

  mutation.mutate(formData);
};

    return (
        <Box className="p-6">
            <Typography
                className="text-black font-bold tracking-wide"
                variant="h5"
                align="center"
                gutterBottom
            >
                🏫 School Settings
            </Typography>
            <div className="flex gap-3 items-center justify-end mb-3">
                <button onClick={() => setCordinateModalOpen(true)} className="bg-[image:var(--gradient-primary)] cursor-pointer py-2 px-3 rounded ">Add Cordinates</button>
                <select
                    value={academicYearFilter}
                    onChange={(e) => setAcademicYearFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
                >
                    <option value="">All Academic Years</option>

                    {academicYearOptionss?.map((year, i) => (
                        <option key={i} value={year.value}>
                            {year.label}
                        </option>
                    ))}
                </select>
            </div>
            {isLoading ? (   <Loader /> ) :(
                  <form onSubmit={handleSubmit}>

                {/* <BasicInfo
                    schoolData={schoolData}
                    handleChange={handleChange}
                /> */}

                {/* <ContactInfo
                    schoolData={schoolData}
                    handleChange={handleChange}
                /> */}

                {/* <AddressSection
                    schoolData={schoolData}
                    handleChange={handleChange}
                    countryOptions={countryOptions}
                    stateOptions={stateOptions}
                    cityOptions={cityOptions}
                /> */}

                <SchoolTiming
                    schoolData={schoolData}
                    handleChange={handleChange}

                />

                <PeriodsSection
                    schoolData={schoolData}
                    handleChange={handleChange}
                    runPeriodsValidation={runPeriodsValidation}
                    getUsedMinutes={getUsedMinutes}
                    getSchoolTotalMinutes={getSchoolTotalMinutes}
                    getTimingStatus={getTimingStatus}
                    getPossibleLunchTimes={getPossibleLunchTimes}

                />

                {/* <MarksSection
                    schoolData={schoolData}
                    setSchoolData={setSchoolData}
                    classOptions={classOptions}
                    handleMarksChange={handleMarksChange}
                    availableOptions={availableOptions}
                /> */}

                {/* <AcademicSession
                    schoolData={schoolData}
                    setSchoolData={setSchoolData}
                    academicYearOptions={academicYearOptions}

                /> */}

                <SchoolLogo
                    schoolData={schoolData}
                    handleChange={handleChange}
                    logoPreview={logoPreview}
                    setLogoPreview={setLogoPreview}
      
                />

                {/* <TollFree
                    schoolData={schoolData}
                    handleChange={handleChange}
                /> */}

                {/* <FAQSection
                    schoolData={schoolData}
                    handleChange={handleChange}
                /> */}

                {/* <BannerSection
                    schoolData={schoolData}
                    handleChange={handleChange}
                                  getImagePreview={getImagePreview}
                /> */}

                {/* <SocialLinks
                    schoolData={schoolData}
                    setSchoolData={setSchoolData}
                    handleSocialChange={handleSocialChange}
                    getSocialLogoPreview={getSocialLogoPreview}
                    urlErrors={urlErrors}
                    setUrlErrors={setUrlErrors}
                    addSocial={addSocial}

                /> */}
                <Box display="flex" justifyContent="space-between" mt={4}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => resetMutation.mutate()}
                    >
                        Reset Defaults
                    </Button>
                    <Button
                        type="submit"
                        // variant="contained"
                        style={{ background: "bg-[rgb(var(--color-primary)_/_1)]", color: "black" }}
                        // color="primary"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? "Saving..." : "Save Settings"}
                    </Button>
                </Box>
            </form>
    
)
// ✅ your custom loader
}
          
              <Modal
                   isOpen={cordinateModalOpen}
                   onClose={() => setCordinateModalOpen(false)}
                   title="Add School Coordinates"
                 >
                   <div className="space-y-5">
                     {/* Header Decoration */}
                     <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-t-lg"></div>
           
                     {/* Detect Current Location */}
                     <button
                       type="button"
                       onClick={detectCurrentLocation}
                       className="w-full bg-[image:var(--gradient-primary)] text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
                     >
                       <span className="text-lg">📍</span>
                       <span>Use Current Location</span>
                     </button>
           
                     {/* Coordinates with yellow accents */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium text-amber-700 ml-1">Coordinates</label>
                       <div className="grid grid-cols-2 gap-3">
                         <div className="relative">
                           <input
                             type="number"
                             placeholder="Latitude"
                             value={locationData.latitude}
                             onChange={(e) =>
                               setLocationData(prev => ({ ...prev, latitude: e.target.value }))
                             }
                             className="w-full border-2 border-yellow-200 focus:border-yellow-400 rounded-xl px-4 py-3 outline-none transition-all duration-200 bg-yellow-50/30 focus:bg-white shadow-sm"
                           />
                           <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-500">°</span>
                         </div>
           
                         <div className="relative">
                           <input
                             type="number"
                             placeholder="Longitude"
                             value={locationData.longitude}
                             onChange={(e) =>
                               setLocationData(prev => ({ ...prev, longitude: e.target.value }))
                             }
                             className="w-full border-2 border-yellow-200 focus:border-yellow-400 rounded-xl px-4 py-3 outline-none transition-all duration-200 bg-yellow-50/30 focus:bg-white shadow-sm"
                           />
                           <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-500">°</span>
                         </div>
                       </div>
                     </div>
           
                     {/* Radius with yellow theme */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium text-amber-700 ml-1">Radius (meters)</label>
                       <div className="relative">
                         <input
                           type="number"
                           placeholder="Enter radius in meters"
                           value={locationData.radiusMeters}
                           onChange={(e) =>
                             setLocationData(prev => ({ ...prev, radiusMeters: e.target.value }))
                           }
                           className="w-full border-2 border-yellow-200 focus:border-yellow-400 rounded-xl px-4 py-3 outline-none transition-all duration-200 bg-yellow-50/30 focus:bg-white shadow-sm"
                         />
                         <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-500 font-medium">m</span>
                       </div>
                     </div>
           
                     {/* Save Button with yellow gradient */}
                     <button
                       type="button"
                       onClick={() => {
                         if (saveLocationMutation.isPending) return;
                         saveLocationMutation.mutate();
                       }}
                       disabled={saveLocationMutation.isPending}
                       className="w-full bg-[image:var(--gradient-primary)]  text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-4"
                     >
                       {saveLocationMutation.isPending ? (
                         <div className="flex items-center justify-center gap-2">
                           <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                           <span>Saving Location...</span>
                         </div>
                       ) : (
                         <div className="flex items-center justify-center gap-2">
                           <span>✨</span>
                           <span>Save Location</span>
                           <span>✨</span>
                         </div>
                       )}
                     </button>
           
                     {/* Decorative yellow elements */}
                     <div className="flex justify-center gap-1 mt-2">
                       <div className="w-2 h-2 rounded-full bg-yellow-300 animate-pulse"></div>
                       <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse delay-75"></div>
                       <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse delay-150"></div>
                     </div>
                   </div>
                 </Modal>
        </Box>
    );
}