import React from "react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { formatDate, formatRelativeDate } from "../../lib/format";

function StudentsTable(props) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Student
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Survey
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                School
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Grade
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Answers
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Updated
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {props.students.map(function mapStudent(student) {
              return (
                <tr key={student.id} className="transition hover:bg-surface-container-low/40">
                  <td className="px-6 py-5">
                    <div className="font-semibold text-on-surface">
                      {student.name} {student.surname}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">{student.email || student.tel}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="font-medium text-on-surface">
                      {student.survey ? student.survey.name : "No survey"}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      Joined {formatDate(student.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="font-medium text-on-surface">{student.school}</div>
                    <div className="mt-1 text-sm text-slate-500">
                      {student.department ? student.department.name : "No department"}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <Badge tone="neutral">
                      {student.grade || "-"} / {student.paralel || "-"}
                    </Badge>
                  </td>
                  <td className="px-6 py-5">
                    <div className="font-semibold text-primary">{student.answers_len}</div>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-500">
                    {formatRelativeDate(student.updatedAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default StudentsTable;
