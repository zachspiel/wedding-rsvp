import pandas as pd
from enum import Enum
import json

data_frame = pd.read_excel("guestList.xlsx")
guests = json.loads(data_frame.to_json(orient='records'))
formatted_guests = []


def get_value_from_colum(guest, key):
    return guest[key] if guest[key] != None else ""


def create_guest(guest, first_name_key, last_name_key, relationship):
    return {
        "title": get_value_from_colum(guest, "Title"),
        "firstName": get_value_from_colum(guest, first_name_key),
        "lastName": get_value_from_colum(guest, last_name_key),
        "rsvp": 0,
        "relationshipType": relationship
    }


for guest in guests:
    formatted_guest = {}
    phone = get_value_from_colum(guest, "Phone Number")
    email = get_value_from_colum(guest, "Email Address")
    address1 = get_value_from_colum(guest, "Street Address")
    address2 = get_value_from_colum(guest, "Street Address (line 2)")
    city = get_value_from_colum(guest, "City")
    state = get_value_from_colum(guest, "State / Region")
    postal = get_value_from_colum(guest, "Zip / Postal Code")
    country = get_value_from_colum(guest, "Country")
    invited = get_value_from_colum(guest, "Total Definitely Invited")
    group_guests = []

    group_guests.append(create_guest(guest, "First Name", "Last Name", 0))

    formatted_guest["phone"] = phone
    formatted_guest["email"] = email
    formatted_guest["adress1"] = address1
    formatted_guest["adress2"] = address2
    formatted_guest["city"] = city
    formatted_guest["state"] = state
    formatted_guest["postal"] = postal
    formatted_guest["country"] = country
    formatted_guest["message"] = ""
    formatted_guest["saveTheDateSent"] = False
    formatted_guest["inviteSent"] = False
    formatted_guest["invited"] = True if invited > 0 else False
    formatted_guest["affiliation"] = 0

    if (guest["Partner First Name"] != None):
        group_guests.append(create_guest(
            guest, "Partner First Name", "Partner Last Name", 1))

    for index in range(5):
        guest_index = str(index + 1)
        first_name_key = "Child {} First Name".format(guest_index)
        last_name_key = "Child {} Last Name".format(guest_index)

        if (guest[first_name_key] != None):
            group_guests.append(create_guest(
                guest, first_name_key, last_name_key, 2))

    formatted_guest["guests"] = group_guests
    formatted_guests.append(formatted_guest)

out_file = open("guests.json", "w")
json.dump(formatted_guests, out_file, indent=6)
out_file.close()
