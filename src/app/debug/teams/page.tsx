import { getTeams } from "@/lib/actions/workspace.actions"

export default async function Page() {
  const teams = await getTeams()

  return (
    <div style={{ padding: 20 }}>
      <h1>Teams</h1>
      <pre style={{ whiteSpace: "pre-wrap", background: "#f6f8fa", padding: 12, borderRadius: 6 }}>
        {JSON.stringify(teams, null, 2)}
      </pre>
    </div>
  )
}
