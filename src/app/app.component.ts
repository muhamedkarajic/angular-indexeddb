import { Component, OnInit, VERSION } from '@angular/core';
import { Dexie } from 'dexie';
import { db, TodoList } from '../db/db';
function log(txt) {
  (document.getElementById('log') as any).value += txt + '\n';
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  drops: any[] = [];
  db = new Dexie('raindrops');

  ngOnInit() {
    this.db.version(1).stores({
      raindrops: 'id,position',
    });

    //
    // Define database
    //
    log('Using Dexie v' + Dexie.semVer);

    //
    // Prepare data
    //
    for (var i = 1; i <= 10000; ++i) {
      this.drops.push({
        id: i,
        position: 1,
        someData: {
          someText: 'some value',
          someNumber: 5,
          ancient: [
            'write',
            [
              -1005176737.0127225,
              'river',
              'finger',
              'habit',
              1303173981,
              false,
            ],
            'properly',
            239808436,
            'river',
            'make',
          ],
          green: -185540282.1253891,
          date: 'feathers',
          record: true,
          many: -755746199.358345,
          whispered: -1905489363,
        },
      });
    }

    this.testPerformance();
  }

  async testPerformance() {
    try {
      //
      // Open Database
      //

      let time: number;
      await this.db.open();
      log(``);
      log(`bulkPut()`);
      log(`=========`);
      log(`Let's put 10,000 documents into indexedthis.db! ...`);
      await new Promise((resolve) => setTimeout(resolve, 1)); // Leave some breath to GC.
      time = performance.now();
      console.log(this.db);
      await (this.db as any).raindrops.bulkPut(this.drops);
      log(
        `Put operations done. Took ${Math.round(
          performance.now() - time
        )} milliseconds.`
      );
      log(``);
      log(`Query`);
      log(`=====`);
      log(`Now get all documents...`);
      time = performance.now();
      const fewDrops = await (this.db as any).raindrops.toArray();
      log(
        `Took ${Math.round(performance.now() - time)} milliseconds to find ${
          fewDrops.length
        } matching documents`
      );
    } catch (err) {
      switch (err && err.name) {
        case 'BulkError':
          log(
            'Some documents did not succeed. However documents was added successfully (not fully)'
          );
          break;
        case 'MissingAPIError':
          log("Couldn't find indexedDB API");
          break;
        case 'SecurityError':
          (document.getElementById('log') as any).style = 'display:none';
          (document.getElementById('safari-version') as any).style = 'display:';
          break;
        default:
          log(err);
          break;
      }
    }
  }
}
