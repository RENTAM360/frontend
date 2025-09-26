export const getAddress = async (lat, lon) => {
    const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
        );
        const data = await res.json();
        return data.display_name;
};

