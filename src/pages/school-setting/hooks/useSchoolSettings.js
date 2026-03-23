
import { useState } from "react";
import { Country, State, City } from "country-state-city";
import apiPath from "../../../api/apiPath";
import { apiGet, apiPost, apiPatch, apiPut } from "../../../api/apiFetch";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";



const initialSchoolData = {
    // schoolName: "",
    // status: "inactive",
    // tollFree: "",
    // address: {
    //     street: "",
    //     city: "",
    //     state: "",
    //     zip: "",
    //     country: "",
    // },
    // contact: {
    //     phone: "",
    //     email: "",
    //     website: "",
    // },
    schoolTiming: {
        startTime: "09:00",
        endTime: "15:00",
    },
    periods: {
        totalPeriods: "",
        periodDuration: "",
        breakDuration: "",
        lunchBreak: {
            isEnabled: false,
            time: "",
            duration: "",
        },
    },
    // academicSession: {
    //     startDate: "",
    //     endDate: "",
    //     currentSession: "",
    // },
    // faqs: [],
    // banner: [],
    // gallery: [],
    // socialLinks: [
    //     {
    //         platform: "",
    //         url: "",
    //         logo: null,
    //     },
    // ],
    schoolLogo: null,
    // marks: [
    //     {
    //         className: "",
    //         halfYearlyMarks: "",
    //         finalYearMarks: "",
    //     },
    // ],
};
export const useSchoolSettings = () => {
    const [schoolData, setSchoolData] = useState(initialSchoolData);
    const [logoPreview, setLogoPreview] = useState(null);
    const [academicYearFilter, setAcademicYearFilter] = useState(null);
    const [cordinateModalOpen, setCordinateModalOpen] = useState(false);
    const [urlErrors, setUrlErrors] = useState([]);
    const SchoolId = localStorage.getItem("schoolId");
    const [schoolSettingId,setschoolSetttingId] = useState("");
    console.log("schoolSettingId",schoolSettingId);

    const [locationData, setLocationData] = useState({
        latitude: "",
        longitude: "",
        radiusMeters: 1000,
        search: "",
    });
    const classesQuery = useQuery({
        queryKey: ["classes"],
        queryFn: () => apiGet(apiPath.classesByNames || "/api/admins/classes"),
    });


    const formatDateForInput = (isoDate) => {
        if (!isoDate) return "";
        return isoDate.split("T")[0]; // "2025-10-13"
    };
    const { data: academicSessions, isLoading: loading, error } = useQuery({
        queryKey: ['academicSessions'],
        queryFn: () => apiGet(apiPath.getAcademicSessions)
    });

    const queryClient = useQueryClient();
    const activeSession = academicSessions?.results?.find(
        (s) => s.status === "active"
    );

    // 🔥 THIS IS KEY
    const selectedSessionId =
        academicYearFilter || activeSession?._id;
    console.log("selectedSessionId", selectedSessionId);
    const { data: schoolSettingsData, isLoading } = useQuery({
        queryKey: ["school-settings", selectedSessionId],
        queryFn: () =>
            apiGet(`${apiPath.getSchoolSettings}/${selectedSessionId}`),
        enabled: !!selectedSessionId,
    });

    // console.log("schoolsettingdata", schoolSettingsData?.results?._id);
    const mutation = useMutation({
        mutationFn: (formData) => {
            if (schoolSettingsData?.results?._id) {
                return apiPut(
                    `${apiPath.updateSchoolSettings}/${schoolSettingsData?.results?._id}`,
                    formData
                );
            } else {
                return apiPost(
                    `${apiPath.createSchoolSettings}`,
                    formData
                );
            }
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(["school-settings"]);
            toast.success(data.message || "Settings saved successfully");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message);
        }
    });
    const resetMutation = useMutation({
        mutationFn: async () => apiPatch(apiPath.resetSchoolSettings),
        onSuccess: (data) => {
            queryClient.invalidateQueries(["school-settings"])
            toast.success(data.message || "Settings reset to defaults");
        },
    });
    const saveLocationMutation = useMutation({
        mutationFn: async () => {
            if (!schoolId) throw new Error("SchoolId missing");

            // Validate coordinates
            const lat = Number(locationData.latitude);
            const lng = Number(locationData.longitude);

            if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                throw new Error("Invalid coordinates");
            }

            const payload = {
                latitude: lat,
                longitude: lng,
                radiusMeters: Number(locationData.radiusMeters),
            };

            // 🔹 Decide POST vs PUT
            if (!cordinatesData?.results) {
                return apiPost(apiPath.addSchoolLocation, {
                    schoolId,
                    ...payload,
                });
            } else {
                return apiPut(`${apiPath.updateSchoolLocation}/${schoolId}/location`, payload);
            }
        },
        onSuccess: () => {
            toast.success("Location saved successfully ✅");
            queryClient.invalidateQueries({ queryKey: ["school-coordinates"] });
            setCordinateModalOpen(false);
        },
        onError: (err) => {
            toast.error(err.message || "Failed to save location ❌");
        },
    });
    const handleChange = (path, value) => {
        setSchoolData((prev) => {

            const keys = path.split(".");
            const newData = structuredClone(prev); // ✅ deep copy

            let temp = newData;

            for (let i = 0; i < keys.length - 1; i++) {
                temp = temp[keys[i]];
            }

            // validation
            if (keys[0] === "schoolTiming") {
                const [h] = value.split(":").map(Number);
                if (h < 7 || h > 16) return prev;
            }

            if (path === "periods.lunchBreak.duration" && Number(value) > 60)
                return prev;

            if (
                ["periods.totalPeriods", "periods.periodDuration", "periods.breakDuration"].includes(path) &&
                Number(value) < 0
            )
                return prev;

            temp[keys[keys.length - 1]] = value;

            return newData;
        });
    };
    useEffect(() => {
        if (schoolSettingsData?.results) {
            setSchoolData((prev) => ({
                ...prev,
                ...schoolSettingsData.results,
            }));

            if (schoolSettingsData.results.schoolLogo) {
                setLogoPreview(schoolSettingsData.results.schoolLogo);
            }
        } else {
            setSchoolData(initialSchoolData);
            setLogoPreview(null);
        }
    }, [schoolSettingsData]);

    useEffect(() => {
        if (activeSession?._id && !academicYearFilter) {
            setAcademicYearFilter(activeSession._id);
        }
    }, [activeSession]);
    // const countryOptions = Country.getAllCountries().map(country => ({
    //     value: country.isoCode,
    //     label: country.name,
    // }));

    // const countryOptions = useMemo(
    //     () => Country.getAllCountries().map(country => ({
    //         value: country.isoCode,
    //         label: country.name,
    //     })),
    //     []
    // )
    // const stateOptions = schoolData.address.country
    //     ? State.getStatesOfCountry(schoolData.address.country).map(state => ({
    //         value: state.isoCode,
    //         label: state.name,
    //     }))
    //     : [];

    // const cityOptions =
    //     schoolData.address.country && schoolData.address.state
    //         ? City.getCitiesOfState(
    //             schoolData.address.country,
    //             schoolData.address.state
    //         ).map(city => ({
    //             value: city.name,
    //             label: city.name,
    //         }))
    //         : [];

    // const handleMarksChange = (index, field, value) => {
    //     setSchoolData(prev => ({
    //         ...prev,
    //         marks: prev.marks.map((m, i) =>
    //             i === index ? { ...m, [field]: value } : m
    //         )
    //     }));
    // };

    const minutesToTime = (mins) => {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    };

    const handleMarksChange = (index, field, value) => {
        setSchoolData(prev => {
            const newData = structuredClone(prev);
            newData.marks[index][field] = value;
            return newData;
        });
    };
    const getEffectiveBreakCount = (totalPeriods, lunchEnabled) => {
        if (totalPeriods <= 1) return 0;

        // lunch enabled → 2 breaks removed
        if (lunchEnabled) {
            return Math.max(totalPeriods - 2, 0);
        }

        // lunch disabled → normal breaks
        return Math.max(totalPeriods - 1, 0);
    };
    const getPossibleLunchTimes = (data) => {
        const { schoolTiming, periods } = data;

        if (
            !schoolTiming.startTime ||
            !periods.totalPeriods ||
            !periods.periodDuration
        ) {
            return [];
        }

        const totalPeriods = Number(periods.totalPeriods);
        const periodDuration = Number(periods.periodDuration);
        const breakDuration = Number(periods.breakDuration || 0);

        let current = timeToMinutes(schoolTiming.startTime);
        const options = [];

        for (let i = 1; i < totalPeriods; i++) {
            // finish period
            current += periodDuration;

            options.push({
                label: `After Period ${i} (${minutesToTime(current)})`,
                value: minutesToTime(current),
            });

            // add break before next period
            current += breakDuration;
        }

        return options;
    };
    const handleSocialChange = (index, field, value) => {
        const trimmedValue = field === "url" ? value.trim() : value;

        // 🔹 Update socialLinks safely
        setSchoolData(prev => {
            // console.log("prev",prev);
            const updated = [...prev.socialLinks];
            updated[index] = {
                ...updated[index],
                [field]: trimmedValue,
            };
            return { ...prev, socialLinks: updated };
        });

        // 🔹 URL validation (onChange)
        if (field === "url") {
            const urlPattern =
                /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/;

            setUrlErrors(prev => {
                const errors = [...prev];
                errors[index] =
                    trimmedValue && !urlPattern.test(trimmedValue)
                        ? "Please enter a valid URL"
                        : "";
                return errors;
            });
        }
    };

    const classOptions = Object.values(classesQuery?.data?.results || []).map((cls) => ({
        label: cls,
        value: cls,
    }));
    const runPeriodsValidation = () => {
        validatePeriodsAgainstSchoolTime(schoolData);
    };
    const getUsedMinutes = (data) => {
        const { periods } = data;

        if (!periods.totalPeriods || !periods.periodDuration) return 0;

        const totalPeriods = Number(periods.totalPeriods);
        const periodDuration = Number(periods.periodDuration);
        const breakDuration = Number(periods.breakDuration || 0);

        const breakCount = getEffectiveBreakCount(
            totalPeriods,
            periods.lunchBreak.isEnabled
        );

        let total =
            totalPeriods * periodDuration +
            breakCount * breakDuration;

        if (periods.lunchBreak.isEnabled && periods.lunchBreak.duration) {
            total += Number(periods.lunchBreak.duration);
        }

        return total;
    };
    const getSchoolTotalMinutes = (data) => {
        const start = timeToMinutes(data.schoolTiming.startTime);
        const end = timeToMinutes(data.schoolTiming.endTime);
        return end - start;
    };
    const getTimingStatus = (data) => {
        const used = getUsedMinutes(data);
        const school = getSchoolTotalMinutes(data);

        if (!used || !school) return { color: "text.secondary", msg: "" };

        if (used > school) {
            return {
                color: "error.main",
                msg: `Over by ${used - school} min`,
            };
        }

        if (used < school) {
            return {
                color: "warning.main",
                msg: `Short by ${school - used} min`,
            };
        }

        return {
            color: "success.main",
            msg: "Perfect match",
        };
    };
    const timeToMinutes = (time) => {
        if (!time) return 0;
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
    };

    // const selected = schoolData.marks.map(m => m.className);
    // const availableOptions = classOptions.filter(
    //     opt => !selected.includes(opt.value)
    // );
    const academicYearOptions = academicSessions?.results?.map(session => ({
        value: session,   // ✅ FULL OBJECT (critical)
        label: session.academicSession,
    }));

    const getSocialLogoPreview = (logo) => {
        if (!logo) return "";

        // New upload
        if (logo instanceof File) {
            return URL.createObjectURL(logo);
        }

        // Existing image URL from backend
        if (typeof logo === "string") {
            return logo.startsWith("http")
                ? logo
                : `${API_BASE}${logo}`;
        }

        return "";
    };
    const addSocial = () => {
        setSchoolData(prev => ({
            ...prev,
            socialLinks: [
                ...(Array.isArray(prev.socialLinks) ? prev.socialLinks : []),
                { platform: "", url: "", logo: null },
            ],
        }));

        setUrlErrors(prev => [...prev, ""]);
    };
    const academicYearOptionss = academicSessions?.results?.map(session => ({
        value: session._id,
        label: session.academicSession,   // what user sees
    }));
    const detectCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation not supported");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                setLocationData(prev => ({
                    ...prev,
                    latitude: lat.toFixed(6),
                    longitude: lng.toFixed(6),
                }));

                toast.success("Location detected ✅");
            },
            (error) => {
                toast.error("Location access denied ❌");
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };
    const getImagePreview = (img) => {
        if (img instanceof File || img instanceof Blob)
            return URL.createObjectURL(img);

        if (typeof img?.image === "string")
            return img.image.startsWith("http")
                ? img.image
                : `${import.meta.env.VITE_API_BASE_URL}${img.image}`;

        return "";
    };
    return {
        schoolData,
        setSchoolData,
        handleChange,
        formatDateForInput,
        // countryOptions,
        // stateOptions,
        // cityOptions,
        handleMarksChange,
        classOptions,
        handleSocialChange,
        runPeriodsValidation,
        getUsedMinutes,
        getSchoolTotalMinutes,
        getTimingStatus,
        // availableOptions,
        academicYearOptions,
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
        minutesToTime,
        isLoading,
        selectedSessionId



    };
};