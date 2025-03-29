from django.core.management.base import BaseCommand
import csv
from api.models import University, College, Course

class Command(BaseCommand):
    help = 'Load university, college, and course data from CSV'

    def handle(self, *args, **kwargs):
        file_path = 'data/all_college_courses.csv'

        with open(file_path, 'r', encoding='utf-8') as file:
            reader = csv.reader(file)
            header = next(reader)  # skip header

            for row in reader:
                university_name, university_code, college_name, college_code, course_name = row[:5]

                # University
                university, _ = University.objects.get_or_create(
                    code=university_code.strip(),
                    defaults={'name': university_name.strip()}
                )

                # College
                college, _ = College.objects.get_or_create(
                    code=college_code.strip(),
                    defaults={
                        'name': college_name.strip(),
                        'university': university
                    }
                )

                # Course
                course, _ = Course.objects.get_or_create(
                    college=college,
                    name=course_name.strip()
                )

                self.stdout.write(f"Added: {university_name} -> {college_name} -> {course_name}")
