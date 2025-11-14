import { NextResponse } from "next/server";

// import all campus course data JSON files
import hawaiiCC from "@/app/lib/data/json_format/hawaiicc_courses.json";
import hilo from "@/app/lib/data/json_format/hilo_courses.json";
import honoluluCC from "@/app/lib/data/json_format/honolulucc_courses.json";
import kapiolani from "@/app/lib/data/json_format/kapiolani_courses.json";
import kauai from "@/app/lib/data/json_format/kauai_courses.json";
import leeward from "@/app/lib/data/json_format/leeward_courses.json";
import manoa from "@/app/lib/data/json_format/manoa_courses.json";
import maui from "@/app/lib/data/json_format/maui_courses.json";
import pcatt from "@/app/lib/data/json_format/pcatt_courses.json";
import westOahu from "@/app/lib/data/json_format/west_oahu_courses.json";

// Define Course interface
interface Course {
  course_id?: string;
  course_prefix?: string;
  course_number?: string;
  course_title?: string;
  dept_name?: string;
  num_units?: string;
  metadata?: string;
  campus?: string;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.toLowerCase() || "";
    const limitParam = Number(searchParams.get("limit"));
    const limit =
      Number.isFinite(limitParam) && limitParam > 0
        ? Math.min(Math.floor(limitParam), 200)
        : 20;
    const campusFilters = searchParams
      .getAll("campus")
      .flatMap(value => value.split(","))
      .map(value => value.trim())
      .filter(Boolean)
      .map(value => value.toLowerCase());
    const extraKeywords = searchParams
      .getAll("keyword")
      .flatMap(value => value.split(","))
      .map(value => value.trim().toLowerCase())
      .filter(Boolean);

    const searchTerms = [
      ...(query ? [query] : []),
      ...extraKeywords,
    ];

    if (searchTerms.length === 0) {
      return NextResponse.json({
        success: true,
        total: 0,
        message: "Please include a search query (e.g., ?q=data)",
        results: [],
      });
    }

    // ✅ safer version: handle JSON that may be parsed as {} instead of []
    const addCampus = (data: unknown, name: string): Course[] => {
      const courses = Array.isArray(data) ? (data as Course[]) : [];
      return courses.map(c => ({ ...c, campus: name }));
    };

    const allCourses: Course[] = [
      ...addCampus(hawaiiCC, "Hawai‘i Community College"),
      ...addCampus(hilo, "University of Hawai‘i at Hilo"),
      ...addCampus(honoluluCC, "Honolulu Community College"),
      ...addCampus(kapiolani, "Kapi‘olani Community College"),
      ...addCampus(kauai, "Kaua‘i Community College"),
      ...addCampus(leeward, "Leeward Community College"),
      ...addCampus(manoa, "University of Hawai‘i at Mānoa"),
      ...addCampus(maui, "University of Hawai‘i Maui College"),
      ...addCampus(
        pcatt,
        "Pacific Center for Advanced Technology Training (PCATT)"
      ),
      ...addCampus(westOahu, "University of Hawai‘i – West O‘ahu"),
    ];

    // filter by title or department name
    const normalizeCourseId = (course: Course) =>
      `${course.course_prefix || ""} ${course.course_number || ""}`
        .trim()
        .toLowerCase();

    const results = allCourses.filter(c => {
      const matchesCampus =
        campusFilters.length === 0 ||
        (c.campus && campusFilters.includes(c.campus.toLowerCase().trim()));

      if (!matchesCampus) return false;

      const courseId = normalizeCourseId(c);
      const title = c.course_title?.toLowerCase() || "";
      const dept = c.dept_name?.toLowerCase() || "";

      return searchTerms.some(term => {
        if (!term) return false;
        return (
          title.includes(term) ||
          dept.includes(term) ||
          (courseId && courseId.includes(term))
        );
      });
    });

    // return top 20 results
    return NextResponse.json({
      success: true,
      total: results.length,
      results: results.slice(0, limit),
    });
  } catch (err: unknown) {
    console.error("Error in /api/programs-courses:", err);

    if (err instanceof Error) {
      return NextResponse.json(
        { success: false, error: err.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Unknown error occurred" },
      { status: 500 }
    );
  }
}
