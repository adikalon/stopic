import {MigrationInterface, QueryRunner} from "typeorm";

export class Structure1655817340467 implements MigrationInterface {
    name = 'Structure1655817340467'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mime" ("id" BIGSERIAL NOT NULL, "type" character varying(15) NOT NULL, CONSTRAINT "UQ_8b45bddc1546288b5846e3f29de" UNIQUE ("type"), CONSTRAINT "PK_bedd3d2a7350e37e6e87025b11c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8b45bddc1546288b5846e3f29d" ON "mime" ("type") `);
        await queryRunner.query(`CREATE TABLE "tag" ("id" BIGSERIAL NOT NULL, "name" character varying(50) NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, CONSTRAINT "UQ_6a9775008add570dc3e5a0bab7b" UNIQUE ("name"), CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6a9775008add570dc3e5a0bab7" ON "tag" ("name") `);
        await queryRunner.query(`CREATE TABLE "download" ("id" BIGSERIAL NOT NULL, "visitorId" bigint NOT NULL, "pictureId" bigint NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_84dcb3c6afdf8b2f9c0b8cd457f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "picture" ("id" BIGSERIAL NOT NULL, "width" smallint NOT NULL, "height" smallint NOT NULL, "size" integer NOT NULL, "link" character varying(255) NOT NULL, "token" character varying(255) NOT NULL, "url" character varying(255) NOT NULL, "title" character varying(255) NOT NULL, "description" character varying(255) NOT NULL, "header" character varying(255) NOT NULL, "content" character varying(255) NOT NULL, "subFolder" character varying(255) NOT NULL, "tinyName" character varying(255) NOT NULL, "tinyAlt" character varying(255) NOT NULL, "tinyTitle" character varying(255) NOT NULL, "tinyWidth" smallint NOT NULL, "tinyHeight" smallint NOT NULL, "smallName" character varying(255) NOT NULL, "smallAlt" character varying(255) NOT NULL, "smallTitle" character varying(255) NOT NULL, "smallWidth" smallint NOT NULL, "smallHeight" smallint NOT NULL, "bigName" character varying(255) NOT NULL, "bigAlt" character varying(255) NOT NULL, "bigTitle" character varying(255) NOT NULL, "bigWidth" smallint NOT NULL, "bigHeight" smallint NOT NULL, "mimeId" bigint NOT NULL, "active" boolean NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, CONSTRAINT "UQ_e9b662d08ba7570af53b97bb0b6" UNIQUE ("link"), CONSTRAINT "UQ_88125344314f6527aa29c914f48" UNIQUE ("token"), CONSTRAINT "CHK_c2e48feb4302f497e1a0b9a11c" CHECK ("tinyName" != "smallName" AND "tinyName" != "bigName" AND "smallName" != "bigName"), CONSTRAINT "CHK_ff05b0808c734481628b4ade51" CHECK ("width" > 0 AND "height" > 0 AND "size" > 0 AND "tinyWidth" > 0 AND "tinyHeight" > 0 AND "smallWidth" > 0 AND "smallHeight" > 0 AND "bigWidth" > 0 AND "bigHeight" > 0), CONSTRAINT "PK_31ccf37c74bae202e771c0c2a38" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_683a70064b46f0a538bfd1ffb8" ON "picture" ("width") `);
        await queryRunner.query(`CREATE INDEX "IDX_96bc634db986296b8f3f712eea" ON "picture" ("height") `);
        await queryRunner.query(`CREATE INDEX "IDX_2941367a47ffc05ddd9fbf4804" ON "picture" ("size") `);
        await queryRunner.query(`CREATE INDEX "IDX_e9b662d08ba7570af53b97bb0b" ON "picture" ("link") `);
        await queryRunner.query(`CREATE INDEX "IDX_88125344314f6527aa29c914f4" ON "picture" ("token") `);
        await queryRunner.query(`CREATE INDEX "IDX_34e232c33ec4bea8acb8877e89" ON "picture" ("url") `);
        await queryRunner.query(`CREATE INDEX "IDX_d93cfedd69a4c96df497ef8843" ON "picture" ("title") `);
        await queryRunner.query(`CREATE INDEX "IDX_289b9e37198f92ff02bee8f62d" ON "picture" ("description") `);
        await queryRunner.query(`CREATE INDEX "IDX_bbaca82f6cd48014fca7aceebf" ON "picture" ("header") `);
        await queryRunner.query(`CREATE INDEX "IDX_87c2cc30898fc026cba70ce954" ON "picture" ("content") `);
        await queryRunner.query(`CREATE INDEX "IDX_f19a644819d72783d03d3d61a4" ON "picture" ("subFolder") `);
        await queryRunner.query(`CREATE INDEX "IDX_41e6fcd027cb52a2627b324fa9" ON "picture" ("tinyName") `);
        await queryRunner.query(`CREATE INDEX "IDX_f18875efe2a0e4e9d1d9c1da9a" ON "picture" ("tinyAlt") `);
        await queryRunner.query(`CREATE INDEX "IDX_23c8dcb62b2c2257727354a599" ON "picture" ("tinyTitle") `);
        await queryRunner.query(`CREATE INDEX "IDX_1633e9134212150577b3fcf3a0" ON "picture" ("tinyWidth") `);
        await queryRunner.query(`CREATE INDEX "IDX_df61dd0bfb4db7c3ef6a39465a" ON "picture" ("tinyHeight") `);
        await queryRunner.query(`CREATE INDEX "IDX_a82122ee61961f842c00ba27e5" ON "picture" ("smallName") `);
        await queryRunner.query(`CREATE INDEX "IDX_5f098c583cd71b9c71f095c2ac" ON "picture" ("smallAlt") `);
        await queryRunner.query(`CREATE INDEX "IDX_6d71b1d939ca9d3df505270441" ON "picture" ("smallTitle") `);
        await queryRunner.query(`CREATE INDEX "IDX_eaccf566a83b34797f70f9a94b" ON "picture" ("smallWidth") `);
        await queryRunner.query(`CREATE INDEX "IDX_2fb5e6f25c788d2fe2e985376c" ON "picture" ("smallHeight") `);
        await queryRunner.query(`CREATE INDEX "IDX_730ab9e880adbacfb6e4b2f1e4" ON "picture" ("bigName") `);
        await queryRunner.query(`CREATE INDEX "IDX_15e4564112968a7353d77ee2a4" ON "picture" ("bigAlt") `);
        await queryRunner.query(`CREATE INDEX "IDX_60f157751eeac870389ab1b431" ON "picture" ("bigTitle") `);
        await queryRunner.query(`CREATE INDEX "IDX_59e9269a7d7528d762e9c7231f" ON "picture" ("bigWidth") `);
        await queryRunner.query(`CREATE INDEX "IDX_d98ff964ebcd3fff630220fb04" ON "picture" ("bigHeight") `);
        await queryRunner.query(`CREATE TABLE "view" ("id" BIGSERIAL NOT NULL, "visitorId" bigint NOT NULL, "pictureId" bigint NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_86cfb9e426c77d60b900fe2b543" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "visitor" ("id" BIGSERIAL NOT NULL, "ip" character varying(105) NOT NULL, "userAgent" character varying(505) NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, CONSTRAINT "UQ_d3dfb6e7caa26a8b6dd56837207" UNIQUE ("ip", "userAgent"), CONSTRAINT "PK_ba6ae421d03de90a99ed838741d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ccdfac0e8e9a4628c6361964be" ON "visitor" ("ip") `);
        await queryRunner.query(`CREATE INDEX "IDX_3a4244d4fc7af19962ccbd5cf9" ON "visitor" ("userAgent") `);
        await queryRunner.query(`CREATE TABLE "banned" ("id" BIGSERIAL NOT NULL, "bannedTo" TIMESTAMP NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "deletedDate" TIMESTAMP, "visitorId" bigint NOT NULL, CONSTRAINT "PK_acc9f19a159ce2536a836f51664" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "picture_tags_tag" ("pictureId" bigint NOT NULL, "tagId" bigint NOT NULL, CONSTRAINT "PK_8397d42a4a3e8fcb6909075b8bd" PRIMARY KEY ("pictureId", "tagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2cb51ac81644aaebadfe1d230a" ON "picture_tags_tag" ("pictureId") `);
        await queryRunner.query(`CREATE INDEX "IDX_eea03df326c9537e5435b5dab5" ON "picture_tags_tag" ("tagId") `);
        await queryRunner.query(`ALTER TABLE "download" ADD CONSTRAINT "FK_f97d77af4b9c61cbf7d62b54e97" FOREIGN KEY ("visitorId") REFERENCES "visitor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "download" ADD CONSTRAINT "FK_b294a75c46ccb1a8d7a437c0cf8" FOREIGN KEY ("pictureId") REFERENCES "picture"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "picture" ADD CONSTRAINT "FK_c9d4fc5fc6a1805c79164a2a858" FOREIGN KEY ("mimeId") REFERENCES "mime"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "view" ADD CONSTRAINT "FK_c7d55d27642ea8d742055c2af14" FOREIGN KEY ("visitorId") REFERENCES "visitor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "view" ADD CONSTRAINT "FK_534bfd820c08793e50051588842" FOREIGN KEY ("pictureId") REFERENCES "picture"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "banned" ADD CONSTRAINT "FK_d0b031ea7f935185b037efe6f0a" FOREIGN KEY ("visitorId") REFERENCES "visitor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "picture_tags_tag" ADD CONSTRAINT "FK_2cb51ac81644aaebadfe1d230af" FOREIGN KEY ("pictureId") REFERENCES "picture"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "picture_tags_tag" ADD CONSTRAINT "FK_eea03df326c9537e5435b5dab5a" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "picture_tags_tag" DROP CONSTRAINT "FK_eea03df326c9537e5435b5dab5a"`);
        await queryRunner.query(`ALTER TABLE "picture_tags_tag" DROP CONSTRAINT "FK_2cb51ac81644aaebadfe1d230af"`);
        await queryRunner.query(`ALTER TABLE "banned" DROP CONSTRAINT "FK_d0b031ea7f935185b037efe6f0a"`);
        await queryRunner.query(`ALTER TABLE "view" DROP CONSTRAINT "FK_534bfd820c08793e50051588842"`);
        await queryRunner.query(`ALTER TABLE "view" DROP CONSTRAINT "FK_c7d55d27642ea8d742055c2af14"`);
        await queryRunner.query(`ALTER TABLE "picture" DROP CONSTRAINT "FK_c9d4fc5fc6a1805c79164a2a858"`);
        await queryRunner.query(`ALTER TABLE "download" DROP CONSTRAINT "FK_b294a75c46ccb1a8d7a437c0cf8"`);
        await queryRunner.query(`ALTER TABLE "download" DROP CONSTRAINT "FK_f97d77af4b9c61cbf7d62b54e97"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eea03df326c9537e5435b5dab5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2cb51ac81644aaebadfe1d230a"`);
        await queryRunner.query(`DROP TABLE "picture_tags_tag"`);
        await queryRunner.query(`DROP TABLE "banned"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3a4244d4fc7af19962ccbd5cf9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ccdfac0e8e9a4628c6361964be"`);
        await queryRunner.query(`DROP TABLE "visitor"`);
        await queryRunner.query(`DROP TABLE "view"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d98ff964ebcd3fff630220fb04"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_59e9269a7d7528d762e9c7231f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_60f157751eeac870389ab1b431"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_15e4564112968a7353d77ee2a4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_730ab9e880adbacfb6e4b2f1e4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2fb5e6f25c788d2fe2e985376c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eaccf566a83b34797f70f9a94b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6d71b1d939ca9d3df505270441"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5f098c583cd71b9c71f095c2ac"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a82122ee61961f842c00ba27e5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_df61dd0bfb4db7c3ef6a39465a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1633e9134212150577b3fcf3a0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_23c8dcb62b2c2257727354a599"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f18875efe2a0e4e9d1d9c1da9a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_41e6fcd027cb52a2627b324fa9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f19a644819d72783d03d3d61a4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_87c2cc30898fc026cba70ce954"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bbaca82f6cd48014fca7aceebf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_289b9e37198f92ff02bee8f62d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d93cfedd69a4c96df497ef8843"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_34e232c33ec4bea8acb8877e89"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_88125344314f6527aa29c914f4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e9b662d08ba7570af53b97bb0b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2941367a47ffc05ddd9fbf4804"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_96bc634db986296b8f3f712eea"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_683a70064b46f0a538bfd1ffb8"`);
        await queryRunner.query(`DROP TABLE "picture"`);
        await queryRunner.query(`DROP TABLE "download"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6a9775008add570dc3e5a0bab7"`);
        await queryRunner.query(`DROP TABLE "tag"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8b45bddc1546288b5846e3f29d"`);
        await queryRunner.query(`DROP TABLE "mime"`);
    }

}
