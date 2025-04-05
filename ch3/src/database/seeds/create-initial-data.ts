import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Channels } from '../../entities/Channels';
import { Workspaces } from '../../entities/Workspaces';

export default class CreateInitialData implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(Workspaces)
      .values([{ id: 1, name: 'Sleact', url: 'sleact' }])
      .execute();

    await dataSource
      .createQueryBuilder()
      .insert()
      .into(Channels)
      .values([{ id: 1, name: '일반', WorkspaceId: 1, private: false }])
      .execute();
  }
}
