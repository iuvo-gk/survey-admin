import React, { useMemo, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import AdminLayout from "../components/layout/AdminLayout";
import StatCard from "../components/dashboard/StatCard";
import StudentsTable from "../components/students/StudentsTable";
import { EmptyPanel, ErrorPanel, LoadingPanel } from "../components/ui/StatePanel";
import { STUDENTS_QUERY } from "../graphql/Queries";

function StudentsPage(props) {
  var [searchValue, setSearchValue] = useState("");
  var studentsQuery = useQuery(STUDENTS_QUERY, { errorPolicy: "all" });
  var students = (studentsQuery.data && studentsQuery.data.students) || [];

  var filteredStudents = useMemo(
    function filterStudents() {
      var query = searchValue.trim().toLowerCase();

      if (!query) {
        return students;
      }

      return students.filter(function matchStudent(student) {
        return [
          student.name,
          student.surname,
          student.email,
          student.school,
          student.survey ? student.survey.name : "",
        ]
          .join(" ")
          .toLowerCase()
          .indexOf(query) !== -1;
      });
    },
    [searchValue, students]
  );

  var totalAnswers = students.reduce(function addAnswers(total, student) {
    return total + (student.answers_len || 0);
  }, 0);

  return (
    <AdminLayout
      currentUser={props.currentUser}
      onLogout={props.session.logout}
      title="Audience"
      description="Review respondent records coming from the `students` query, including survey membership, school, department, and answer volume."
      eyebrow="Audience"
      searchValue={searchValue}
      onSearchChange={function onSearchChange(event) {
        setSearchValue(event.target.value);
      }}
    >
      {studentsQuery.loading && !students.length ? <LoadingPanel label="Loading respondents..." /> : null}

      {studentsQuery.error && !students.length ? (
        <ErrorPanel message={studentsQuery.error.message} retry={studentsQuery.refetch} />
      ) : null}

      {!studentsQuery.loading && !studentsQuery.error && !filteredStudents.length ? (
        <EmptyPanel
          icon="group_off"
          title={students.length ? "No respondents match your search" : "No respondents yet"}
          description="Once respondents submit answers, this page will show their profile and survey participation data."
        />
      ) : null}

      {filteredStudents.length ? (
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <StatCard
              label="Students"
              value={students.length}
              caption="Total respondent records."
              icon="group"
              iconBackground="bg-primary-fixed text-primary"
            />
            <StatCard
              label="Visible"
              value={filteredStudents.length}
              caption="Rows after search filtering."
              icon="visibility"
              iconBackground="bg-secondary-container text-secondary"
            />
            <StatCard
              label="Answers"
              value={totalAnswers}
              caption="Sum of `answers_len` across respondents."
              icon="forum"
              iconBackground="bg-amber-100 text-amber-700"
            />
          </div>

          <StudentsTable students={filteredStudents} />
        </div>
      ) : null}
    </AdminLayout>
  );
}

export default StudentsPage;
