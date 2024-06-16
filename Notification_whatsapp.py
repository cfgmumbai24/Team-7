from googletrans import Translator
import firebase_admin
from firebase_admin import credentials, storage
from twilio.rest import Client
import json
import schedule
import time
from datetime import datetime, timedelta

# Initialize Firebase Admin SDK
cred = credentials.Certificate("jpmc-34b4a-firebase-adminsdk-l6r7t-ada8502c68.json")
firebase_admin.initialize_app(cred, {'storageBucket': 'jpmc-34b4a.appspot.com'})

# Initialize Firebase Storage client
bucket = storage.bucket()

# Your Twilio credentials
account_sid = 'AC9734774af87fb3eb53f14ead0086352a'
auth_token = ''
client_twilio = Client(account_sid, auth_token)

# Initialize Google Translator

# Function to translate text
def translate_text(text, target_lang='mr'):
    translator = Translator()
    translated_text = translator.translate(text, dest=target_lang).text
    return translated_text

# Function to fetch user data from Firebase Storage
def get_user_data(username):
    blob = bucket.blob(f'users/{username}.json')
    try:
        user_data = blob.download_as_string()
        return user_data.decode('utf-8')
    except Exception as e:
        print(f"Failed to retrieve user data for {username}: {e}")
        return None

# Function to send WhatsApp message
def send_whatsapp_message(phone_number, message_body, target_language='mr'):
    try:
        translated_message = translate_text(message_body, target_language)
        message = client_twilio.messages.create(
            from_='whatsapp:+14155238886',
            body=translated_message,
            to=f'whatsapp:{phone_number}'
        )
        print("Message sent:", message.sid)
    except Exception as e:
        print(f"Failed to send message to {phone_number}: {e}")

# Function to fetch user data and process messages
def process_users():
    users_with_streak_zero = []
    users_with_completed_goals = []
    users_with_remaining_goals = []

    # Iterate through each user
    for blob in bucket.list_blobs(prefix='users/'):
        if blob.name.endswith('.json'):
            username = blob.name.split('/')[-1].split('.')[0]
            user_data = get_user_data(username)
            if user_data:
                user_data_json = json.loads(user_data)
                streak = user_data_json.get('streak', 0)
                goals_completed = user_data_json.get('goals_completed', 0)
                goals_out_of = user_data_json.get('goals_out_of', 0)
                phone_number = user_data_json.get('contact_number', '')

                if streak == 0:
                    users_with_streak_zero.append(username)
                    message_body = f"Oops {username}, you forgot to login today. Your streak count falls back to 0."
                    send_whatsapp_message(phone_number, message_body)
                elif goals_completed == goals_out_of:
                    users_with_completed_goals.append(username)
                    message_body = f"Congratulations {username}! You have completed all your goals."
                    send_whatsapp_message(phone_number, message_body)
                else:
                    users_with_remaining_goals.append(username)
                    remaining_goals = goals_out_of - goals_completed
                    message_body = f"Hi {username}, you have {remaining_goals} more goals left to complete! Keep up the pace!"
                    send_whatsapp_message(phone_number, message_body)
                    
    print("Users with streak count falling back to 0:", users_with_streak_zero)
    print("Users with completed goals:", users_with_completed_goals)
    print("Users with remaining goals:", users_with_remaining_goals)

def process_government_schemes():
    one_month_ago = datetime.now() - timedelta(days=30)
    new_schemes = []

    for blob in bucket.list_blobs(prefix='uploads/government_schemes/'):
        if blob.name.endswith('.json'):
            scheme_data = json.loads(blob.download_as_string().decode('utf-8'))
            date_of_upload = datetime.strptime(scheme_data.get('date_of_upload'), '%Y-%m-%d')
            description = scheme_data.get('description', '')

            if date_of_upload >= one_month_ago:
                new_schemes.append(description)

                subscribers = ['+918499994076']
                for phone_number in subscribers:
                    send_whatsapp_message(phone_number, description)

    # Print some statistics
    print("New schemes uploaded in the last month:", new_schemes)

# Schedule the process to run every 24 hours
schedule.every().days.do(process_users)
schedule.every().months.do(process_government_schemes)

# Keep the script running
while True:
    schedule.run_pending()
    time.sleep(1)
