import { useState, useEffect } from 'react';
import { ENDPOINTS } from '../utils/api';

interface LocationOption {
    id: string;
    name: string;
}

interface LocationData {
    states: LocationOption[];
    districts: LocationOption[];
    mandals: LocationOption[];
    grampanchayats: LocationOption[];
}

export const useLocationData = () => {
    const [locationData, setLocationData] = useState<LocationData>({
        states: [],
        districts: [],
        mandals: [],
        grampanchayats: []
    });

    useEffect(() => {
        fetchStates();
    }, []);

    const fetchStates = async () => {
        try {
            const res = await fetch(ENDPOINTS.GET_STATES);
            const data = await res.json();
            setLocationData(prev => ({ ...prev, states: data }));
        } catch (error) {
            console.error("Failed to fetch states:", error);
        }
    };

    const fetchDistricts = async (stateId: string) => {
        try {
            const res = await fetch(`${ENDPOINTS.GET_DISTRICTS}?state_id=${stateId}`);
            const data = await res.json();
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
            const res = await fetch(`${ENDPOINTS.GET_MANDALS}?district_id=${districtId}`);
            const data = await res.json();
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
            const res = await fetch(`${ENDPOINTS.GET_GRAMPANCHAYATS}?mandal_id=${mandalId}`);
            const data = await res.json();
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