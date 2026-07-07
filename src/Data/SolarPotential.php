<?php

namespace Data;

class SolarPotential {
    public static function getSolarPotentialByState(): array {
        return [
            "rajasthan" => [ 'grade' => "A+", 'sunHours' => 6.0, 'bestDistricts' => ["Jodhpur", "Jaisalmer", "Bikaner", "Barmer"] ],
            "gujarat" => [ 'grade' => "A+", 'sunHours' => 5.8, 'bestDistricts' => ["Kutch", "Banaskantha", "Jamnagar", "Bhavnagar"] ],
            "ladakh" => [ 'grade' => "A+", 'sunHours' => 6.1, 'bestDistricts' => ["Leh", "Kargil"] ],
            "haryana" => [ 'grade' => "A", 'sunHours' => 5.4, 'bestDistricts' => ["Hisar", "Gurugram", "Karnal"] ],
            "punjab" => [ 'grade' => "A", 'sunHours' => 5.3, 'bestDistricts' => ["Ludhiana", "Bathinda", "Amritsar"] ],
            "himachal-pradesh" => [ 'grade' => "B+", 'sunHours' => 4.9, 'bestDistricts' => ["Kangra", "Una", "Solan"] ],
            "uttarakhand" => [ 'grade' => "B+", 'sunHours' => 4.7, 'bestDistricts' => ["Dehradun", "Haridwar", "Udham Singh Nagar"] ],
            "jammu-and-kashmir" => [ 'grade' => "B+", 'sunHours' => 4.9, 'bestDistricts' => ["Jammu", "Srinagar", "Anantnag"] ],
            "delhi" => [ 'grade' => "B+", 'sunHours' => 5.2, 'bestDistricts' => ["New Delhi", "South Delhi", "Dwarka"] ],
            "chandigarh" => [ 'grade' => "B+", 'sunHours' => 4.9, 'bestDistricts' => ["Chandigarh"] ],
            "madhya-pradesh" => [ 'grade' => "A", 'sunHours' => 5.5, 'bestDistricts' => ["Indore", "Bhopal", "Ujjain", "Gwalior"] ],
            "chhattisgarh" => [ 'grade' => "B+", 'sunHours' => 5.1, 'bestDistricts' => ["Raipur", "Bilaspur", "Durg"] ],
            "maharashtra" => [ 'grade' => "A", 'sunHours' => 5.3, 'bestDistricts' => ["Nagpur", "Pune", "Nashik", "Aurangabad"] ],
            "goa" => [ 'grade' => "B+", 'sunHours' => 5.2, 'bestDistricts' => ["North Goa", "South Goa"] ],
            "karnataka" => [ 'grade' => "A", 'sunHours' => 5.4, 'bestDistricts' => ["Bellary", "Chitradurga", "Tumakuru", "Bengaluru Rural"] ],
            "telangana" => [ 'grade' => "A", 'sunHours' => 5.5, 'bestDistricts' => ["Hyderabad", "Rangareddy", "Mahbubnagar"] ],
            "andhra-pradesh" => [ 'grade' => "A", 'sunHours' => 5.5, 'bestDistricts' => ["Anantapur", "Kurnool", "Kadapa", "Nellore"] ],
            "tamil-nadu" => [ 'grade' => "A", 'sunHours' => 5.3, 'bestDistricts' => ["Coimbatore", "Tirunelveli", "Salem", "Thoothukudi"] ],
            "kerala" => [ 'grade' => "B+", 'sunHours' => 5.0, 'bestDistricts' => ["Palakkad", "Ernakulam", "Thiruvananthapuram"] ],
            "puducherry" => [ 'grade' => "B+", 'sunHours' => 5.2, 'bestDistricts' => ["Puducherry"] ],
            "lakshadweep" => [ 'grade' => "B+", 'sunHours' => 5.3, 'bestDistricts' => ["Kavaratti"] ],
            "odisha" => [ 'grade' => "B+", 'sunHours' => 4.9, 'bestDistricts' => ["Khordha", "Cuttack", "Sambalpur"] ],
            "west-bengal" => [ 'grade' => "B", 'sunHours' => 4.6, 'bestDistricts' => ["Kolkata", "Howrah", "Durgapur"] ],
            "bihar" => [ 'grade' => "B", 'sunHours' => 4.7, 'bestDistricts' => ["Patna", "Gaya", "Muzaffarpur"] ],
            "jharkhand" => [ 'grade' => "B", 'sunHours' => 4.7, 'bestDistricts' => ["Ranchi", "Jamshedpur", "Dhanbad"] ],
            "assam" => [ 'grade' => "B", 'sunHours' => 4.3, 'bestDistricts' => ["Guwahati (Kamrup)", "Dibrugarh", "Silchar (Cachar)"] ],
            "arunachal-pradesh" => [ 'grade' => "B", 'sunHours' => 4.2, 'bestDistricts' => ["Itanagar", "Pasighat"] ],
            "manipur" => [ 'grade' => "B", 'sunHours' => 4.1, 'bestDistricts' => ["Imphal", "Thoubal"] ],
            "meghalaya" => [ 'grade' => "B", 'sunHours' => 4.0, 'bestDistricts' => ["Shillong", "Tura"] ],
            "mizoram" => [ 'grade' => "B", 'sunHours' => 4.1, 'bestDistricts' => ["Aizawl", "Lunglei"] ],
            "nagaland" => [ 'grade' => "B", 'sunHours' => 4.1, 'bestDistricts' => ["Kohima", "Dimapur"] ],
            "sikkim" => [ 'grade' => "B", 'sunHours' => 4.2, 'bestDistricts' => ["Gangtok", "Namchi"] ],
            "tripura" => [ 'grade' => "B", 'sunHours' => 4.2, 'bestDistricts' => ["Agartala", "Udaipur"] ],
            "andaman-and-nicobar-islands" => [ 'grade' => "B+", 'sunHours' => 5.1, 'bestDistricts' => ["Port Blair", "South Andaman"] ],
            "dadra-and-nagar-haveli-and-daman-and-diu" => [ 'grade' => "A", 'sunHours' => 5.6, 'bestDistricts' => ["Daman", "Silvassa"] ],
            "uttar-pradesh" => [ 'grade' => "B+", 'sunHours' => 4.9, 'bestDistricts' => ["Agra", "Lucknow", "Kanpur", "Varanasi"] ],
        ];
    }

    public static function getSolarPotentialStateRows(): array {
        $statesList = StateData::getAllStatesAndUTs();
        $potential = self::getSolarPotentialByState();
        $rows = [];
        foreach ($statesList as $s) {
            $slug = $s['slug'];
            $name = $s['name'];
            $row = $potential[$slug] ?? [ 'grade' => "B", 'sunHours' => 4.7, 'bestDistricts' => [$name] ];
            $rows[] = array_merge(['slug' => $slug, 'name' => $name], $row);
        }
        return $rows;
    }
}
