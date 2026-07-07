<?php

namespace Data;

class CityData {
    public static function getTopCities(): array {
        return [
            ['slug' => 'ahmedabad', 'name' => 'Ahmedabad', 'stateSlug' => 'gujarat', 'stateName' => 'Gujarat', 'discom' => 'UGVCL', 'avgTariff' => '₹5.50', 'sunHours' => 5.8],
            ['slug' => 'mumbai', 'name' => 'Mumbai', 'stateSlug' => 'maharashtra', 'stateName' => 'Maharashtra', 'discom' => 'MSEDCL / BEST', 'avgTariff' => '₹6.00', 'sunHours' => 5.3],
            ['slug' => 'delhi', 'name' => 'Delhi', 'stateSlug' => 'delhi', 'stateName' => 'Delhi', 'discom' => 'BSES / TPDDL', 'avgTariff' => '₹6.50', 'sunHours' => 5.2],
            ['slug' => 'bangalore', 'name' => 'Bangalore', 'stateSlug' => 'karnataka', 'stateName' => 'Karnataka', 'discom' => 'BESCOM', 'avgTariff' => '₹6.15', 'sunHours' => 5.4],
            ['slug' => 'pune', 'name' => 'Pune', 'stateSlug' => 'maharashtra', 'stateName' => 'Maharashtra', 'discom' => 'MSEDCL', 'avgTariff' => '₹6.00', 'sunHours' => 5.4],
            ['slug' => 'hyderabad', 'name' => 'Hyderabad', 'stateSlug' => 'telangana', 'stateName' => 'Telangana', 'discom' => 'TSSPDCL', 'avgTariff' => '₹5.80', 'sunHours' => 5.5],
            ['slug' => 'chennai', 'name' => 'Chennai', 'stateSlug' => 'tamil-nadu', 'stateName' => 'Tamil Nadu', 'discom' => 'TANGEDCO', 'avgTariff' => '₹5.30', 'sunHours' => 5.3],
            ['slug' => 'jaipur', 'name' => 'Jaipur', 'stateSlug' => 'rajasthan', 'stateName' => 'Rajasthan', 'discom' => 'JVVNL', 'avgTariff' => '₹5.75', 'sunHours' => 5.9],
            ['slug' => 'lucknow', 'name' => 'Lucknow', 'stateSlug' => 'uttar-pradesh', 'stateName' => 'Uttar Pradesh', 'discom' => 'MVVNL', 'avgTariff' => '₹5.50', 'sunHours' => 4.9],
            ['slug' => 'surat', 'name' => 'Surat', 'stateSlug' => 'gujarat', 'stateName' => 'Gujarat', 'discom' => 'DGVCL', 'avgTariff' => '₹5.50', 'sunHours' => 5.7],
            ['slug' => 'kolkata', 'name' => 'Kolkata', 'stateSlug' => 'west-bengal', 'stateName' => 'West Bengal', 'discom' => 'CESC', 'avgTariff' => '₹5.20', 'sunHours' => 4.8],
            ['slug' => 'chandigarh', 'name' => 'Chandigarh', 'stateSlug' => 'chandigarh', 'stateName' => 'Chandigarh', 'discom' => 'PSPCL', 'avgTariff' => '₹5.00', 'sunHours' => 4.9],
            ['slug' => 'indore', 'name' => 'Indore', 'stateSlug' => 'madhya-pradesh', 'stateName' => 'Madhya Pradesh', 'discom' => 'MPMKVVCL', 'avgTariff' => '₹5.25', 'sunHours' => 5.5],
            ['slug' => 'bhopal', 'name' => 'Bhopal', 'stateSlug' => 'madhya-pradesh', 'stateName' => 'Madhya Pradesh', 'discom' => 'MPMKVVCL', 'avgTariff' => '₹5.25', 'sunHours' => 5.4],
            ['slug' => 'nagpur', 'name' => 'Nagpur', 'stateSlug' => 'maharashtra', 'stateName' => 'Maharashtra', 'discom' => 'MSEDCL', 'avgTariff' => '₹6.00', 'sunHours' => 5.5],
            ['slug' => 'vadodara', 'name' => 'Vadodara', 'stateSlug' => 'gujarat', 'stateName' => 'Gujarat', 'discom' => 'MGVCL', 'avgTariff' => '₹5.50', 'sunHours' => 5.7],
            ['slug' => 'coimbatore', 'name' => 'Coimbatore', 'stateSlug' => 'tamil-nadu', 'stateName' => 'Tamil Nadu', 'discom' => 'TANGEDCO', 'avgTariff' => '₹5.30', 'sunHours' => 5.5],
            ['slug' => 'patna', 'name' => 'Patna', 'stateSlug' => 'bihar', 'stateName' => 'Bihar', 'discom' => 'SBPDCL', 'avgTariff' => '₹5.00', 'sunHours' => 4.8],
            ['slug' => 'jodhpur', 'name' => 'Jodhpur', 'stateSlug' => 'rajasthan', 'stateName' => 'Rajasthan', 'discom' => 'JDVVNL', 'avgTariff' => '₹5.75', 'sunHours' => 6.0],
            ['slug' => 'agra', 'name' => 'Agra', 'stateSlug' => 'uttar-pradesh', 'stateName' => 'Uttar Pradesh', 'discom' => 'DVVNL', 'avgTariff' => '₹5.50', 'sunHours' => 5.0]
        ];
    }

    public static function getCityBySlug(string $slug): ?array {
        $cities = self::getTopCities();
        foreach ($cities as $c) {
            if ($c['slug'] === $slug) {
                return $c;
            }
        }
        return null;
    }

    public static function getNearbyCities(string $slug): array {
        $city = self::getCityBySlug($slug);
        if (!$city) {
            return [];
        }

        $cities = self::getTopCities();
        $sameState = [];
        foreach ($cities as $c) {
            if ($c['slug'] !== $slug && $c['stateSlug'] === $city['stateSlug']) {
                $sameState[] = $c;
            }
        }

        if (count($sameState) >= 6) {
            return array_slice($sameState, 0, 6);
        }

        $fallback = [];
        foreach ($cities as $c) {
            if ($c['slug'] !== $slug && $c['stateSlug'] !== $city['stateSlug']) {
                $fallback[] = $c;
            }
        }

        $needed = 6 - count($sameState);
        $fallback = array_slice($fallback, 0, $needed);

        return array_merge($sameState, $fallback);
    }
}
