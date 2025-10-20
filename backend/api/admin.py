from django.contrib import admin
from django.utils import timezone
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from .models import (
    UserProfile, State, District, Mandal, GramPanchayat,
    Host, Speaker, Event, SpeakerAvailability, Payment, Message, EventRating,
    OTPVerification, PendingUser, Conversation, ContactSubmission
)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'gender', 'occupation', 'state', 'district']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']
    list_filter = ['gender', 'state', 'qualification']


@admin.register(State)
class StateAdmin(admin.ModelAdmin):
    list_display = ['id', 'state_name']
    search_fields = ['state_name']


@admin.register(District)
class DistrictAdmin(admin.ModelAdmin):
    list_display = ['id', 'district_name', 'state']
    search_fields = ['district_name']
    list_filter = ['state']


@admin.register(Mandal)
class MandalAdmin(admin.ModelAdmin):
    list_display = ['id', 'mandal_name', 'district']
    search_fields = ['mandal_name']
    list_filter = ['district']


@admin.register(GramPanchayat)
class GramPanchayatAdmin(admin.ModelAdmin):
    list_display = ['id', 'gram_panchayat_name', 'mandal']
    search_fields = ['gram_panchayat_name']
    list_filter = ['mandal']


@admin.register(Host)
class HostAdmin(admin.ModelAdmin):
    list_display = ['user', 'company_name', 'organization_type', 'approval_status_colored', 'verified', 'created_at']
    search_fields = ['user__email', 'company_name', 'user__first_name', 'user__last_name']
    list_filter = ['approval_status', 'organization_type', 'verified', 'created_at']
    readonly_fields = ['created_at', 'updated_at', 'approved_at', 'approved_by']
    fieldsets = (
        ('User Information', {
            'fields': ('user', 'company_name', 'organization_type', 'website', 'bio', 'profile_image')
        }),
        ('Verification', {
            'fields': ('verified',)
        }),
        ('Approval Status', {
            'fields': ('approval_status', 'rejection_reason', 'approved_at', 'approved_by'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    actions = ['approve_hosts', 'reject_hosts']

    @admin.display(description='Approval Status')
    def approval_status_colored(self, obj):
        colors = {
            'pending': 'orange',
            'approved': 'green',
            'rejected': 'red'
        }
        color = colors.get(obj.approval_status, 'gray')
        return f'<span style="color: {color}; font-weight: bold;">{obj.get_approval_status_display()}</span>'
    approval_status_colored.allow_tags = True

    @admin.action(description='Approve selected Hosts')
    def approve_hosts(self, request, queryset):
        for host in queryset:
            if host.approval_status != 'approved':
                host.approval_status = 'approved'
                host.approved_at = timezone.now()
                host.approved_by = request.user
                host.rejection_reason = ''
                host.save()

                # Send approval email
                self.send_approval_email(host)

        self.message_user(request, f'{queryset.count()} host(s) approved successfully.')

    @admin.action(description='Reject selected Hosts')
    def reject_hosts(self, request, queryset):
        for host in queryset:
            if host.approval_status != 'rejected':
                host.approval_status = 'rejected'
                host.rejection_reason = 'Your application did not meet our requirements.'
                host.approved_at = None
                host.approved_by = None
                host.save()

                # Send rejection email
                self.send_rejection_email(host)

        self.message_user(request, f'{queryset.count()} host(s) rejected.')

    def send_approval_email(self, host):
        """Send approval email to host using HTML template"""
        try:
            subject = '🎉 Your Host Account Has Been Approved!'

            # Get login URL
            login_url = f"{settings.CORS_ALLOWED_ORIGINS[0]}/host-login" if settings.CORS_ALLOWED_ORIGINS else "http://localhost:3000/host-login"
            support_email = settings.EMAIL_HOST_USER

            # Render HTML template
            html_content = render_to_string('emails/account_approved.html', {
                'first_name': host.user.first_name or 'there',
                'user_type': 'Host',
                'login_url': login_url,
                'SUPPORT_EMAIL': support_email,
            })

            # Plain text fallback
            text_content = f'''
Dear {host.user.first_name},

Congratulations! Your Host account for {host.company_name} has been approved by our admin team.

You can now log in to your account and start posting speaking requests.

Login here: {login_url}

Thank you for joining Connect & Inspire!

Best regards,
The Connect & Inspire Team
            '''

            # Create email
            email = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[host.user.email]
            )
            email.attach_alternative(html_content, "text/html")
            email.send(fail_silently=False)

        except Exception as e:
            print(f"Error sending approval email: {e}")

    def send_rejection_email(self, host):
        """Send rejection email to host using HTML template"""
        try:
            subject = 'Update on Your Host Account Application'

            support_email = settings.EMAIL_HOST_USER
            rejection_reason = host.rejection_reason or 'Your application did not meet our requirements at this time.'

            # Render HTML template
            html_content = render_to_string('emails/account_rejected.html', {
                'first_name': host.user.first_name or 'there',
                'user_type': 'Host',
                'rejection_reason': rejection_reason,
                'SUPPORT_EMAIL': support_email,
            })

            # Plain text fallback
            text_content = f'''
Dear {host.user.first_name},

Thank you for your interest in joining Connect & Inspire as a Host.

After careful review, we regret to inform you that your application has not been approved at this time.

Reason: {rejection_reason}

If you have any questions or would like to reapply, please contact our support team at {support_email}.

Best regards,
The Connect & Inspire Team
            '''

            # Create email
            email = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[host.user.email]
            )
            email.attach_alternative(html_content, "text/html")
            email.send(fail_silently=False)

        except Exception as e:
            print(f"Error sending rejection email: {e}")


@admin.register(Speaker)
class SpeakerAdmin(admin.ModelAdmin):
    list_display = ['user', 'expertise', 'experience_years', 'approval_status_colored', 'availability_status', 'created_at']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'speaking_topics']
    list_filter = ['approval_status', 'expertise', 'availability_status', 'created_at']
    readonly_fields = ['created_at', 'updated_at', 'approved_at', 'approved_by']
    fieldsets = (
        ('User Information', {
            'fields': ('user', 'bio', 'profile_image', 'website')
        }),
        ('Professional Details', {
            'fields': ('expertise', 'speaking_topics', 'experience_years', 'hourly_rate', 'industry', 'location', 'languages')
        }),
        ('Social Media', {
            'fields': ('social_media',),
            'classes': ('collapse',)
        }),
        ('Availability', {
            'fields': ('availability_status',)
        }),
        ('Approval Status', {
            'fields': ('approval_status', 'rejection_reason', 'approved_at', 'approved_by'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    actions = ['approve_speakers', 'reject_speakers']

    @admin.display(description='Approval Status')
    def approval_status_colored(self, obj):
        colors = {
            'pending': 'orange',
            'approved': 'green',
            'rejected': 'red'
        }
        color = colors.get(obj.approval_status, 'gray')
        return f'<span style="color: {color}; font-weight: bold;">{obj.get_approval_status_display()}</span>'
    approval_status_colored.allow_tags = True

    @admin.action(description='Approve selected Speakers')
    def approve_speakers(self, request, queryset):
        for speaker in queryset:
            if speaker.approval_status != 'approved':
                speaker.approval_status = 'approved'
                speaker.approved_at = timezone.now()
                speaker.approved_by = request.user
                speaker.rejection_reason = ''
                speaker.save()

                # Send approval email
                self.send_approval_email(speaker)

        self.message_user(request, f'{queryset.count()} speaker(s) approved successfully.')

    @admin.action(description='Reject selected Speakers')
    def reject_speakers(self, request, queryset):
        for speaker in queryset:
            if speaker.approval_status != 'rejected':
                speaker.approval_status = 'rejected'
                speaker.rejection_reason = 'Your application did not meet our requirements.'
                speaker.approved_at = None
                speaker.approved_by = None
                speaker.save()

                # Send rejection email
                self.send_rejection_email(speaker)

        self.message_user(request, f'{queryset.count()} speaker(s) rejected.')

    def send_approval_email(self, speaker):
        """Send approval email to speaker using HTML template"""
        try:
            subject = '🎉 Your Speaker Account Has Been Approved!'

            # Get login URL
            login_url = f"{settings.CORS_ALLOWED_ORIGINS[0]}/speaker-login" if settings.CORS_ALLOWED_ORIGINS else "http://localhost:3000/speaker-login"
            support_email = settings.EMAIL_HOST_USER

            # Render HTML template
            html_content = render_to_string('emails/account_approved.html', {
                'first_name': speaker.user.first_name or 'there',
                'user_type': 'Speaker',
                'login_url': login_url,
                'SUPPORT_EMAIL': support_email,
            })

            # Plain text fallback
            text_content = f'''
Dear {speaker.user.first_name},

Congratulations! Your Speaker account has been approved by our admin team.

You can now log in to your account and start accepting speaking requests from organizers.

Login here: {login_url}

Thank you for joining Connect & Inspire!

Best regards,
The Connect & Inspire Team
            '''

            # Create email
            email = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[speaker.user.email]
            )
            email.attach_alternative(html_content, "text/html")
            email.send(fail_silently=False)

        except Exception as e:
            print(f"Error sending approval email: {e}")

    def send_rejection_email(self, speaker):
        """Send rejection email to speaker using HTML template"""
        try:
            subject = 'Update on Your Speaker Account Application'

            support_email = settings.EMAIL_HOST_USER
            rejection_reason = speaker.rejection_reason or 'Your application did not meet our requirements at this time.'

            # Render HTML template
            html_content = render_to_string('emails/account_rejected.html', {
                'first_name': speaker.user.first_name or 'there',
                'user_type': 'Speaker',
                'rejection_reason': rejection_reason,
                'SUPPORT_EMAIL': support_email,
            })

            # Plain text fallback
            text_content = f'''
Dear {speaker.user.first_name},

Thank you for your interest in joining Connect & Inspire as a Speaker.

After careful review, we regret to inform you that your application has not been approved at this time.

Reason: {rejection_reason}

If you have any questions or would like to reapply, please contact our support team at {support_email}.

Best regards,
The Connect & Inspire Team
            '''

            # Create email
            email = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[speaker.user.email]
            )
            email.attach_alternative(html_content, "text/html")
            email.send(fail_silently=False)

        except Exception as e:
            print(f"Error sending rejection email: {e}")


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'speaker', 'organizer_name', 'event_date', 'status', 'created_at']
    search_fields = ['title', 'organizer_name', 'organizer_email']
    list_filter = ['status', 'event_type', 'urgency']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'event_date'


@admin.register(SpeakerAvailability)
class SpeakerAvailabilityAdmin(admin.ModelAdmin):
    list_display = ['speaker', 'date', 'is_available', 'notes']
    search_fields = ['speaker__user__email']
    list_filter = ['is_available', 'date']
    date_hierarchy = 'date'


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ['id', 'host', 'speaker', 'event', 'subject', 'created_at', 'updated_at']
    search_fields = ['host__email', 'speaker__email', 'subject']
    list_filter = ['created_at']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['conversation', 'sender', 'recipient', 'is_read', 'created_at']
    search_fields = ['sender__email', 'recipient__email', 'body']
    list_filter = ['is_read', 'created_at']
    readonly_fields = ['created_at']


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['event', 'amount', 'status', 'payment_method', 'payment_date']
    search_fields = ['event__title', 'transaction_id']
    list_filter = ['status', 'payment_method']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(EventRating)
class EventRatingAdmin(admin.ModelAdmin):
    list_display = ['event', 'speaker', 'rating', 'would_recommend', 'created_at']
    search_fields = ['event__title', 'organizer_name']
    list_filter = ['rating', 'would_recommend']
    readonly_fields = ['created_at']


@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):
    list_display = ['email', 'otp_code', 'purpose', 'is_verified', 'attempts', 'created_at', 'expires_at']
    search_fields = ['email']
    list_filter = ['purpose', 'is_verified']
    readonly_fields = ['created_at']


@admin.register(PendingUser)
class PendingUserAdmin(admin.ModelAdmin):
    list_display = ['email', 'user_type', 'first_name', 'last_name', 'is_email_verified', 'created_at']
    search_fields = ['email', 'first_name', 'last_name']
    list_filter = ['user_type', 'is_email_verified']
    readonly_fields = ['created_at']


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'is_responded', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    list_filter = ['is_responded', 'created_at']
    readonly_fields = ['created_at']
    list_editable = ['is_responded']
