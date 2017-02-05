import React from 'react';
import Helmet from 'react-helmet';
import { datatable, orm } from 'common/redux/modules';
import { Content, PageHeader, Breadcrumbs, Tables, Panel } from 'common/components';

const TicketTable = datatable.dataTable({
  table: 'tickets',
  actionCreator: orm.Ticket.actions.fetch,
  mapData: (ids, state) => {
    const session = orm.selectors.getSession(state);
    const { Ticket } = session;
    const tickets = Ticket.all().filter(t => ids.includes(t.id)).toModelArray();
    return tickets;
  },
})(Tables.Ticket);

export default () => (
  <Content>
    <Helmet title="Главная" />
    <PageHeader title="Главная панель">
      <Breadcrumbs>
        <Breadcrumbs.Item active>Главная панель</Breadcrumbs.Item>
      </Breadcrumbs>
    </PageHeader>
    <Panel>
      <Panel.Title icon="picture-o">
        TITLE
        <Panel.Tools>
          <Panel.Tools.Collapse />
          <Panel.Tools.Fullsize />
          <Panel.Tools.Close />
        </Panel.Tools>
      </Panel.Title>
      <Panel.Body>
        <TicketTable />
      </Panel.Body>
      <Panel.Footer>
        FOOTER
      </Panel.Footer>
    </Panel>
  </Content>
);
