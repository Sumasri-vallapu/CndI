import { useState, useEffect } from 'react';
import { ENDPOINTS } from '../utils/api';

interface LocationOption {
    id: string;
    name: string;
}

interface LocationData {
    districts: LocationOption[];
    mandals: LocationOption[];
    grampanchayats: LocationOption[];
}

export const useLocationData = () => {
    const [locationData, setLocationData] = useState<LocationData>({
        districts: [],
        mandals: [],
        grampanchayats: []
    });

    useEffect(() => {
        // Since we have only one state (Telangana), auto load districts for it
        fetchDistricts("36");
    }, []);

    const fetchDistricts = async (stateId: string = "36") => {
        try {
            const url = `${ENDPOINTS.GET_DISTRICTS}?state_id=${stateId}`;
            console.log("Fetching districts from:", url);
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            console.log("Districts loaded:", data.length, "items");
            setLocationData(prev => ({
                ...prev,
                districts: data,
                mandals: [],
                grampanchayats: []
            }));
        } catch (error) {
            console.error("Failed to fetch districts:", error);
        }
    };

    const fetchMandals = async (districtId: string) => {
        try {
            const url = `${ENDPOINTS.GET_MANDALS}?district_id=${districtId}`;
            console.log("Fetching mandals from:", url);
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            console.log("Mandals loaded:", data.length, "items");
            setLocationData(prev => ({
                ...prev,
                mandals: data,
                grampanchayats: []
            }));
        } catch (error) {
            console.error("Failed to fetch mandals:", error);
        }
    };

    const fetchGrampanchayats = async (mandalId: string) => {
        try {
            const url = `${ENDPOINTS.GET_GRAMPANCHAYATS}?mandal_id=${mandalId}`;
            console.log("Fetching grampanchayats from:", url);
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            console.log("Grampanchayats loaded:", data.length, "items");
            setLocationData(prev => ({
                ...prev,
                grampanchayats: data
            }));
        } catch (error) {
            console.error("Failed to fetch grampanchayats:", error);
        }
    };

    return {
        locationData,
        fetchDistricts,
        fetchMandals,
        fetchGrampanchayats
    };
};
