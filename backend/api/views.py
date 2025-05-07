from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import os
from django.conf import settings

class NameSubmitView(APIView):
    def post(self, request):
        name = request.data.get("name", "").strip()
        if not name:
            return Response({"error": "Name is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            filepath = os.path.join(settings.BASE_DIR, "names.txt")
            with open(filepath, "a") as file:
                file.write(name + "\n")
            return Response({"message": "Name saved successfully."})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
