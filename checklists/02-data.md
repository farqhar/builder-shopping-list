# Data

**Last verified:** 2026-11-19

**Who this is for:** Anyone storing data that real people would miss if it disappeared: accounts, orders, content.
**When to do it:** Before launch, then again whenever you change your tables or upgrade or downgrade your plan.

New to tables and relationships? Read the
[database design guide](../guides/database-design.md) first. This checklist
assumes it.

## If you only do three

1. **[Know what backups you actually have](#know-what-backups-your-plan-includes).** On some plans, the answer is none.
2. **[Test a restore](#test-a-restore-before-you-need-one).** A backup you've never restored is a guess.
3. **[Change your tables with migrations](#change-your-tables-with-migrations).** Not by clicking around in your live database.

## Track your progress

Copy this list into a GitHub issue in your own repo to get boxes you can tick.

```markdown
- [ ] Every table has a primary key
- [ ] Relationships use foreign keys, and each one has an index
- [ ] I've chosen what happens when linked rows are deleted
- [ ] Dates use timestamptz, and money uses integer cents or numeric
- [ ] Table changes go through migrations saved in Git
- [ ] I test changes on a separate database before production
- [ ] I know what backups my plan includes
- [ ] I've decided whether I need point-in-time recovery
- [ ] Uploaded files are backed up separately
- [ ] I've tested a restore
- [ ] I know that deleting a project deletes its backups
```

## Structure

### Give every table a primary key

- **What:** Each table has a column, usually `id`, whose value is unique for every row (a **[primary key](../glossary.md#primary-key)**).
- **Why it matters:** Without one, you can't reliably point at, update or link a single row. Supabase advises creating a primary key for every table.
- **How to check:** Supabase's Performance Advisor flags "Table has no primary key". Open your dashboard, then Advisors, then Performance Advisor.
- **Learn more:** [Supabase: Primary keys](https://supabase.com/docs/guides/database/tables#primary-keys) · [Supabase: Advisors](https://supabase.com/docs/guides/observability/advisors)

### Link tables with foreign keys, and index them

- **What:** When one table refers to another (an order's `user_id`), make that column a **[foreign key](../glossary.md#foreign-key)**, and add an **[index](../glossary.md#index)** on it.
- **Why it matters:** The foreign key stops links to rows that don't exist. Postgres doesn't index foreign keys automatically, and without an index, lookups and permission checks get slow as your data grows.
- **How to check:** The Performance Advisor flags "Unindexed foreign keys". Fix each one with `create index on public.<table> (<column>);`.
- **Learn more:** [Postgres: Foreign keys](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK) · [Database design guide: Relationships](../guides/database-design.md#3-link-tables-with-foreign-keys)

### Choose what happens when something is deleted

- **What:** For every foreign key, decide whether deleting the parent row also deletes the children (`cascade`), is refused (`restrict`), or just clears the link (`set null`).
- **Why it matters:** The wrong choice either leaves orphaned rows, or silently deletes data you needed, like a customer's order history.
- **How to check:** Search your migrations for `references`. Every one should have an `on delete` you chose on purpose.
- **Learn more:** [Postgres: Foreign keys](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK) · [Supabase: Cascade deletes](https://supabase.com/docs/guides/database/postgres/cascade-deletes)

### Use the right types for dates and money

- **What:** Store points in time as `timestamptz`, and money as whole cents in an `integer` (or as `numeric`).
- **Why it matters:** Plain `timestamp` loses time zone information, and the `money` type has known problems. The Postgres project's own wiki recommends against both.
- **How to check:** Search your migrations for columns typed `timestamp` (rather than `timestamptz`) or `money`.
- **Learn more:** [Postgres wiki: Don't Do This](https://wiki.postgresql.org/wiki/Don%27t_Do_This)

## Changing your tables

### Change your tables with migrations

- **What:** Make every change to your database structure as a **[migration](../glossary.md#migration)**: a timestamped SQL file in your repo, applied with the Supabase CLI.
- **Why it matters:** Migrations give you a history of every change, can be reviewed in a pull request, and can be replayed on a fresh database. Dashboard clicks leave no record.
- **How to check:** Your repo has a `supabase/migrations/` folder, and its latest file matches your live database. `supabase migration new <name>` creates a new one.
- **Learn more:** [Supabase: Database migrations](https://supabase.com/docs/guides/deployment/database-migrations)

### Test changes on a separate database first

- **What:** Keep at least one database that isn't production, such as a local development database or a separate **[staging](../glossary.md#staging-environment)** project, and apply migrations there first.
- **Why it matters:** A mistake in a migration, like dropping the wrong column, should break a test database, not your customers' data. Supabase's environments guide uses separate staging and production projects, with developers "never touching the remote database directly".
- **How to check:** You can name the database you test on, and it isn't the one your users use.
- **Learn more:** [Supabase: Managing environments](https://supabase.com/docs/guides/deployment/managing-environments)

## Backups

### Know what backups your plan includes

- **What:** Find out what your database host backs up, how often, and for how long.
- **Why it matters:** Supabase automatically backs up Pro, Team and Enterprise projects daily, keeping 7, 14 or 30 days. Its production checklist notes that backups aren't available for download on the Free plan. On Free, take your own backups with `supabase db dump`.
- **How to check:** Open your dashboard, then Database, then Backups. If the list is empty, you have no backups.
- **Learn more:** [Supabase: Database backups](https://supabase.com/docs/guides/platform/backups) · [Supabase CLI: db dump](https://supabase.com/docs/reference/cli/supabase-db-dump)

### Decide whether you need point-in-time recovery

- **What:** **[Point-in-time recovery (PITR)](../glossary.md#point-in-time-recovery-pitr)** lets you restore to any moment, down to the second, instead of to last night's backup.
- **Why it matters:** With daily backups, a mistake at 5pm can cost you everything since the previous night. Decide how much data you could afford to lose.
- **How to check:** If losing a day of orders or sign-ups is unacceptable, look at PITR. On Supabase it's a paid add-on.
- **Learn more:** [Supabase: Point-in-time recovery](https://supabase.com/docs/guides/platform/backups#point-in-time-recovery)

### Back up uploaded files separately

- **What:** Files people upload (images, PDFs) usually live in file storage, not in the database.
- **Why it matters:** Supabase's database backups don't include objects in Storage. The database only holds information *about* them, so restoring an old backup won't bring back deleted files.
- **How to check:** If your app stores uploads, write down how those files would be recovered. If you don't know, they wouldn't be.
- **Learn more:** [Supabase: Database backups](https://supabase.com/docs/guides/platform/backups)

### Test a restore before you need one

- **What:** Restore a backup into a separate database and check that your data is really there.
- **Why it matters:** You only find out a backup is broken or incomplete when you try to use it. AWS's reliability guidance calls for regularly recovering data to prove backups work.
- **How to check:** On paid Supabase plans, restore a backup to a *new* project, which leaves production untouched. On Free, load a `supabase db dump` file into your local development database. Either way, count the rows in your most important tables and compare them with production.
- **Learn more:** [Supabase: Restore to a new project](https://supabase.com/docs/guides/platform/clone-project) · [AWS: Test your backups](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_backing_up_data_periodic_recovery_testing_data.html)

### Know that deleting a project deletes its backups

- **What:** On Supabase, deleting a project permanently deletes its data and every backup.
- **Why it matters:** "Clean up old projects" can quietly become "delete the only copy".
- **How to check:** Before deleting any project, take a `supabase db dump` and keep it somewhere safe.
- **Learn more:** [Supabase: Database backups](https://supabase.com/docs/guides/platform/backups)

## Further reading

- [Database design guide](../guides/database-design.md): tables, keys and relationships, explained
- [Supabase: Tables and data](https://supabase.com/docs/guides/database/tables)
- [Supabase: Database backups](https://supabase.com/docs/guides/platform/backups)
- [Supabase: Managing environments](https://supabase.com/docs/guides/deployment/managing-environments)
