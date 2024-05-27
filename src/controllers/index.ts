import { fetchContacts, fetchLeads, fetchUsers } from "../utils/http";
import express, { NextFunction, Request, Response } from "express";


export class RootController {
  public readonly router = express.Router();

  constructor() {
    this.router.get("/leads", this.leads);
  }

  private async leads(req: Request, res: Response, next: NextFunction): Promise<void> {

    const { query } = req.query;

    const search = typeof query === 'string' && query.length > 2 ? query : undefined;

    try {

      const [leadsResponse, usersResponse, contactsResponse] = await Promise.all([fetchLeads(search), fetchUsers(), fetchContacts()]);


      const leads: any[] = leadsResponse.data._embedded.leads;
      const users: any[] = usersResponse.data._embedded.users;
      const contacts: any[] = contactsResponse.data._embedded.contacts;



      const userMap = users.reduce((acc, user) => {
        acc[user.id] = user.name;
        return acc;
      }, {});

      const contactMap = contacts.reduce((acc, contact) => {

        acc[contact.id] = {
          name: contact.name,
          phone: contact.custom_fields_values?.find((field: any) => field.field_name === 'Телефон').values[0].value || undefined,
          email: contact.custom_fields_values?.find((field: any) => field.field_name === 'Телефон').values[0].value || undefined
        };
        return acc;
      }, {});
      const dealsWithUserNames = leads.map(lead => ({
        ...lead,
        responsible_user_name: userMap[lead.responsible_user_id] || 'Unknown',
        contacts: lead._embedded.contacts.map((contact: any) => contactMap[contact.id]) || []
      }));


      res.json(dealsWithUserNames);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send("Упс.");
    }
  }




}
